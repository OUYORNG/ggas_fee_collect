import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, FeeItem, FeeCategory, FeeStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  // ==================== FEE ITEMS ====================

  async createFeeItem(data: Prisma.FeeItemCreateInput): Promise<FeeItem> {
    return this.prisma.feeItem.create({ data });
  }

  async findAllFeeItems(category?: string) {
    const where = category ? { category: category as FeeCategory } : {};
    return this.prisma.feeItem.findMany({
      where,
      include: { grade: true, program: true },
      orderBy: { category: 'asc' },
    });
  }

  async findFeeItem(id: string): Promise<FeeItem> {
    const item = await this.prisma.feeItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Fee item not found');
    return item;
  }

  async updateFeeItem(id: string, data: Prisma.FeeItemUpdateInput): Promise<FeeItem> {
    return this.prisma.feeItem.update({ where: { id }, data });
  }

  async deleteFeeItem(id: string): Promise<void> {
    await this.prisma.feeItem.delete({ where: { id } });
  }

  // ==================== STUDENT FEES ====================

  async generateStudentFees(studentId: string, periodId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { grade: { include: { programs: true } } },
    });

    if (!student) throw new NotFoundException('Student not found');

    // Get applicable fee items
    const feeItems = await this.prisma.feeItem.findMany({
      where: {
        OR: [
          { gradeId: student.gradeId }, // Grade-specific fees
          { gradeId: null }, // Global fees
        ],
        periodType: { not: 'ONETIME' }, // Recurring fees
      },
    });

    const period = await this.prisma.period.findUnique({ where: { id: periodId } });
    if (!period) throw new NotFoundException('Period not found');

    const createdFees = [];

    for (const item of feeItems) {
      // Check if fee already exists
      const existing = await this.prisma.studentFee.findUnique({
        where: {
          studentId_feeItemId_periodId: {
            studentId,
            feeItemId: item.id,
            periodId,
          },
        },
      });

      if (!existing) {
        const fee = await this.prisma.studentFee.create({
          data: {
            studentId,
            feeItemId: item.id,
            periodId,
            baseAmount: item.amount,
            totalAmount: item.amount,
            status: 'PENDING' as FeeStatus,
            dueDate: item.dueDate,
          },
        });
        createdFees.push(fee);
      }
    }

    return createdFees;
  }

  // ==================== FEE CALCULATION (WITH DISCOUNTS & VOUCHERS) ====================

  async calculateFee(
    studentFeeId: string,
    options: {
      applySiblingDiscount?: boolean;
      applyEarlyPaymentDiscount?: boolean;
      applyFullYearDiscount?: boolean;
      applyOutstandingDiscount?: boolean;
      applyStaffDiscount?: boolean;
      scholarshipDiscount?: number;
      voucherCode?: string;
    }
  ) {
    const studentFee = await this.prisma.studentFee.findUnique({
      where: { id: studentFeeId },
      include: {
        student: { include: { grade: true } },
        feeItem: true,
        discounts: { include: { discountType: true } },
        vouchers: { include: { voucher: true } },
      },
    });

    if (!studentFee) throw new NotFoundException('Student fee not found');

    let totalDiscount = 0;
    let totalVoucher = 0;
    const appliedDiscounts = [];
    const appliedVouchers = [];

    // 1. SIBLING DISCOUNT (Category: FAMILY)
    if (options.applySiblingDiscount) {
      const siblings = await this.prisma.student.findMany({
        where: { familyId: studentFee.student.familyId || '' },
      });

      const siblingCount = siblings.length;
      let siblingDiscount = 0;

      if (siblingCount >= 2) {
        siblingDiscount = studentFee.baseAmount * 0.05; // 5%
      }
      if (siblingCount >= 3) {
        siblingDiscount = studentFee.baseAmount * 0.10; // 10%
      }

      if (siblingDiscount > 0) {
        totalDiscount += siblingDiscount;
        appliedDiscounts.push({ type: 'SIBLING', amount: siblingDiscount });
      }
    }

    // 2. EARLY PAYMENT DISCOUNT (Category: PAYMENT)
    if (options.applyEarlyPaymentDiscount && studentFee.dueDate) {
      const today = new Date();
      if (today < studentFee.dueDate) {
        const earlyDiscount = studentFee.baseAmount * 0.03; // 3%
        totalDiscount += earlyDiscount;
        appliedDiscounts.push({ type: 'EARLY_PAYMENT', amount: earlyDiscount });
      }
    }

    // 3. FULL YEAR DISCOUNT (Category: PAYMENT)
    if (options.applyFullYearDiscount) {
      const fullYearDiscount = studentFee.baseAmount * 0.05; // 5%
      totalDiscount += fullYearDiscount;
      appliedDiscounts.push({ type: 'FULL_YEAR', amount: fullYearDiscount });
    }

    // 4. OUTSTANDING STUDENT DISCOUNT (Category: SPECIAL)
    if (options.applyOutstandingDiscount) {
      const outstandingDiscount = studentFee.baseAmount * 0.10; // 10%
      totalDiscount += outstandingDiscount;
      appliedDiscounts.push({ type: 'OUTSTANDING', amount: outstandingDiscount });
    }

    // 5. STAFF DISCOUNT (Category: SPECIAL)
    if (options.applyStaffDiscount) {
      const staffDiscount = studentFee.baseAmount * 0.20; // 20%
      totalDiscount += staffDiscount;
      appliedDiscounts.push({ type: 'STAFF', amount: staffDiscount });
    }

    // 6. SCHOLARSHIP (Category: SPECIAL)
    if (options.scholarshipDiscount && options.scholarshipDiscount > 0) {
      const scholarshipAmount = studentFee.baseAmount * (options.scholarshipDiscount / 100);
      totalDiscount += scholarshipAmount;
      appliedDiscounts.push({ type: 'SCHOLARSHIP', amount: scholarshipAmount });
    }

    // Cap discounts to max 3 (excluding sibling which is counted once)
    const maxDiscounts = 3;
    if (appliedDiscounts.length > maxDiscounts) {
      // Sort by amount and keep top 3
      appliedDiscounts.sort((a, b) => b.amount - a.amount);
      const keptDiscounts = appliedDiscounts.slice(0, maxDiscounts);
      totalDiscount = keptDiscounts.reduce((sum, d) => sum + d.amount, 0);
    }

    // 7. VOUCHER (after discounts)
    if (options.voucherCode) {
      const voucher = await this.prisma.voucher.findUnique({
        where: { code: options.voucherCode },
      });

      if (voucher && voucher.isActive) {
        // Check validity
        const now = new Date();
        if (voucher.validFrom && now < voucher.validFrom) {
          throw new BadRequestException('Voucher not yet valid');
        }
        if (voucher.validTo && now > voucher.validTo) {
          throw new BadRequestException('Voucher expired');
        }
        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
          throw new BadRequestException('Voucher usage limit reached');
        }

        // Check if voucher applies to this fee category
        if (voucher.targetCategory && voucher.targetCategory !== studentFee.feeItem.category) {
          throw new BadRequestException('Voucher not applicable to this fee category');
        }

        // Calculate voucher amount
        let voucherAmount = 0;
        if (voucher.type === 'PERCENTAGE') {
          const afterDiscount = studentFee.baseAmount - totalDiscount;
          voucherAmount = afterDiscount * (voucher.value / 100);
        } else {
          voucherAmount = voucher.value;
        }

        totalVoucher = voucherAmount;
        appliedVouchers.push({ code: voucher.code, amount: voucherAmount });

        // Update voucher usage
        await this.prisma.voucher.update({
          where: { id: voucher.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    // Calculate final total
    const finalTotal = Math.max(0, studentFee.baseAmount - totalDiscount - totalVoucher);

    // Update student fee
    const updatedFee = await this.prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        discountAmount: totalDiscount,
        voucherAmount: totalVoucher,
        totalAmount: finalTotal,
      },
    });

    return {
      baseAmount: studentFee.baseAmount,
      discounts: appliedDiscounts,
      totalDiscount,
      voucher: appliedVouchers,
      totalVoucher,
      finalTotal,
    };
  }

  // ==================== GET STUDENT FEES ====================

  async getStudentFees(studentId: string, status?: string) {
    const where: any = { studentId };
    if (status) where.status = status;

    return this.prisma.studentFee.findMany({
      where,
      include: {
        feeItem: true,
        period: true,
        payments: true,
        discounts: { include: { discountType: true } },
        vouchers: { include: { voucher: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  // ==================== APPLY DISCOUNT ====================

  async applyDiscount(
    studentFeeId: string,
    discountTypeId: string,
    notes?: string
  ) {
    const studentFee = await this.prisma.studentFee.findUnique({
      where: { id: studentFeeId },
    });

    if (!studentFee) throw new NotFoundException('Student fee not found');

    const discountType = await this.prisma.discountType.findUnique({
      where: { id: discountTypeId },
    });

    if (!discountType) throw new NotFoundException('Discount type not found');

    // Calculate discount amount
    let appliedAmount = 0;
    if (discountType.type === 'PERCENTAGE') {
      appliedAmount = studentFee.baseAmount * (discountType.value / 100);
    } else {
      appliedAmount = discountType.value;
    }

    // Check if discount already applied
    const existing = await this.prisma.studentDiscount.findUnique({
      where: {
        studentFeeId_discountTypeId: {
          studentFeeId,
          discountTypeId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Discount already applied');
    }

    // Apply discount
    const discount = await this.prisma.studentDiscount.create({
      data: {
        studentFeeId,
        discountTypeId,
        appliedAmount,
        notes,
      },
    });

    // Update student fee
    const newDiscountTotal = studentFee.discountAmount + appliedAmount;
    await this.prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        discountAmount: newDiscountTotal,
        totalAmount: Math.max(0, studentFee.baseAmount - newDiscountTotal - studentFee.voucherAmount),
      },
    });

    return discount;
  }
}
