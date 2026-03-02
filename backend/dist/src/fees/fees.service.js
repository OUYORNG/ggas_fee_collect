"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let FeesService = class FeesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFeeItem(data) {
        return this.prisma.feeItem.create({ data });
    }
    async findAllFeeItems(category) {
        const where = category ? { category: category } : {};
        return this.prisma.feeItem.findMany({
            where,
            include: { grade: true, program: true },
            orderBy: { category: 'asc' },
        });
    }
    async findFeeItem(id) {
        const item = await this.prisma.feeItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Fee item not found');
        return item;
    }
    async updateFeeItem(id, data) {
        return this.prisma.feeItem.update({ where: { id }, data });
    }
    async deleteFeeItem(id) {
        await this.prisma.feeItem.delete({ where: { id } });
    }
    async generateStudentFees(studentId, periodId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { grade: { include: { programs: true } } },
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const feeItems = await this.prisma.feeItem.findMany({
            where: {
                OR: [
                    { gradeId: student.gradeId },
                    { gradeId: null },
                ],
                periodType: { not: 'ONETIME' },
            },
        });
        const period = await this.prisma.period.findUnique({ where: { id: periodId } });
        if (!period)
            throw new common_1.NotFoundException('Period not found');
        const createdFees = [];
        for (const item of feeItems) {
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
                        status: 'PENDING',
                        dueDate: item.dueDate,
                    },
                });
                createdFees.push(fee);
            }
        }
        return createdFees;
    }
    async calculateFee(studentFeeId, options) {
        const studentFee = await this.prisma.studentFee.findUnique({
            where: { id: studentFeeId },
            include: {
                student: { include: { grade: true } },
                feeItem: true,
                discounts: { include: { discountType: true } },
                vouchers: { include: { voucher: true } },
            },
        });
        if (!studentFee)
            throw new common_1.NotFoundException('Student fee not found');
        let totalDiscount = 0;
        let totalVoucher = 0;
        const appliedDiscounts = [];
        const appliedVouchers = [];
        if (options.applySiblingDiscount) {
            const siblings = await this.prisma.student.findMany({
                where: { familyId: studentFee.student.familyId || '' },
            });
            const siblingCount = siblings.length;
            let siblingDiscount = 0;
            if (siblingCount >= 2) {
                siblingDiscount = studentFee.baseAmount * 0.05;
            }
            if (siblingCount >= 3) {
                siblingDiscount = studentFee.baseAmount * 0.10;
            }
            if (siblingDiscount > 0) {
                totalDiscount += siblingDiscount;
                appliedDiscounts.push({ type: 'SIBLING', amount: siblingDiscount });
            }
        }
        if (options.applyEarlyPaymentDiscount && studentFee.dueDate) {
            const today = new Date();
            if (today < studentFee.dueDate) {
                const earlyDiscount = studentFee.baseAmount * 0.03;
                totalDiscount += earlyDiscount;
                appliedDiscounts.push({ type: 'EARLY_PAYMENT', amount: earlyDiscount });
            }
        }
        if (options.applyFullYearDiscount) {
            const fullYearDiscount = studentFee.baseAmount * 0.05;
            totalDiscount += fullYearDiscount;
            appliedDiscounts.push({ type: 'FULL_YEAR', amount: fullYearDiscount });
        }
        if (options.applyOutstandingDiscount) {
            const outstandingDiscount = studentFee.baseAmount * 0.10;
            totalDiscount += outstandingDiscount;
            appliedDiscounts.push({ type: 'OUTSTANDING', amount: outstandingDiscount });
        }
        if (options.applyStaffDiscount) {
            const staffDiscount = studentFee.baseAmount * 0.20;
            totalDiscount += staffDiscount;
            appliedDiscounts.push({ type: 'STAFF', amount: staffDiscount });
        }
        if (options.scholarshipDiscount && options.scholarshipDiscount > 0) {
            const scholarshipAmount = studentFee.baseAmount * (options.scholarshipDiscount / 100);
            totalDiscount += scholarshipAmount;
            appliedDiscounts.push({ type: 'SCHOLARSHIP', amount: scholarshipAmount });
        }
        const maxDiscounts = 3;
        if (appliedDiscounts.length > maxDiscounts) {
            appliedDiscounts.sort((a, b) => b.amount - a.amount);
            const keptDiscounts = appliedDiscounts.slice(0, maxDiscounts);
            totalDiscount = keptDiscounts.reduce((sum, d) => sum + d.amount, 0);
        }
        if (options.voucherCode) {
            const voucher = await this.prisma.voucher.findUnique({
                where: { code: options.voucherCode },
            });
            if (voucher && voucher.isActive) {
                const now = new Date();
                if (voucher.validFrom && now < voucher.validFrom) {
                    throw new common_1.BadRequestException('Voucher not yet valid');
                }
                if (voucher.validTo && now > voucher.validTo) {
                    throw new common_1.BadRequestException('Voucher expired');
                }
                if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
                    throw new common_1.BadRequestException('Voucher usage limit reached');
                }
                if (voucher.targetCategory && voucher.targetCategory !== studentFee.feeItem.category) {
                    throw new common_1.BadRequestException('Voucher not applicable to this fee category');
                }
                let voucherAmount = 0;
                if (voucher.type === 'PERCENTAGE') {
                    const afterDiscount = studentFee.baseAmount - totalDiscount;
                    voucherAmount = afterDiscount * (voucher.value / 100);
                }
                else {
                    voucherAmount = voucher.value;
                }
                totalVoucher = voucherAmount;
                appliedVouchers.push({ code: voucher.code, amount: voucherAmount });
                await this.prisma.voucher.update({
                    where: { id: voucher.id },
                    data: { usedCount: { increment: 1 } },
                });
            }
        }
        const finalTotal = Math.max(0, studentFee.baseAmount - totalDiscount - totalVoucher);
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
    async getStudentFees(studentId, status) {
        const where = { studentId };
        if (status)
            where.status = status;
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
    async applyDiscount(studentFeeId, discountTypeId, notes) {
        const studentFee = await this.prisma.studentFee.findUnique({
            where: { id: studentFeeId },
        });
        if (!studentFee)
            throw new common_1.NotFoundException('Student fee not found');
        const discountType = await this.prisma.discountType.findUnique({
            where: { id: discountTypeId },
        });
        if (!discountType)
            throw new common_1.NotFoundException('Discount type not found');
        let appliedAmount = 0;
        if (discountType.type === 'PERCENTAGE') {
            appliedAmount = studentFee.baseAmount * (discountType.value / 100);
        }
        else {
            appliedAmount = discountType.value;
        }
        const existing = await this.prisma.studentDiscount.findUnique({
            where: {
                studentFeeId_discountTypeId: {
                    studentFeeId,
                    discountTypeId,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Discount already applied');
        }
        const discount = await this.prisma.studentDiscount.create({
            data: {
                studentFeeId,
                discountTypeId,
                appliedAmount,
                notes,
            },
        });
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
};
exports.FeesService = FeesService;
exports.FeesService = FeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeesService);
//# sourceMappingURL=fees.service.js.map