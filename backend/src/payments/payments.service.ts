import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, Payment, PaymentStatus, FeeStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    studentId: string;
    studentFeeId?: string;
    amount: number;
    paymentMethod: string;
    transactionRef?: string;
    collectedBy?: string;
    notes?: string;
  }): Promise<Payment> {
    // Generate receipt number
    const count = await this.prisma.payment.count();
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const payment = await this.prisma.payment.create({
      data: {
        studentId: data.studentId,
        studentFeeId: data.studentFeeId,
        amount: data.amount,
        paymentMethod: data.paymentMethod as any,
        transactionRef: data.transactionRef,
        receiptNumber,
        status: 'COMPLETED' as PaymentStatus,
        collectedBy: data.collectedBy,
        notes: data.notes,
      },
    });

    // Update student fee status if fee ID provided
    if (data.studentFeeId) {
      const fee = await this.prisma.studentFee.findUnique({
        where: { id: data.studentFeeId },
        include: { payments: true },
      });

      if (fee) {
        const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
        
        let newStatus: FeeStatus = 'PARTIAL';
        if (totalPaid >= fee.totalAmount) {
          newStatus = 'PAID';
        }

        await this.prisma.studentFee.update({
          where: { id: data.studentFeeId },
          data: { 
            status: newStatus,
            paidAt: newStatus === 'PAID' ? new Date() : undefined,
          },
        });
      }
    }

    return payment;
  }

  async findAll(studentId?: string) {
    const where = studentId ? { studentId } : {};
    return this.prisma.payment.findMany({
      where,
      include: {
        student: true,
        studentFee: { include: { feeItem: true } },
      },
      orderBy: { paymentDate: 'desc' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        student: true,
        studentFee: { include: { feeItem: true } },
      },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async findByReceipt(receiptNumber: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({
      where: { receiptNumber },
      include: {
        student: true,
        studentFee: { include: { feeItem: true } },
      },
    });
    if (!payment) throw new NotFoundException('Receipt not found');
    return payment;
  }

  async getStudentPaymentHistory(studentId: string) {
    return this.prisma.payment.findMany({
      where: { studentId },
      include: {
        studentFee: { include: { feeItem: true } },
      },
      orderBy: { paymentDate: 'desc' },
    });
  }

  async getTotalCollected(startDate?: Date, endDate?: Date) {
    const where: any = {
      status: 'COMPLETED',
    };

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = startDate;
      if (endDate) where.paymentDate.lte = endDate;
    }

    const payments = await this.prisma.payment.findMany({ where });
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }
}
