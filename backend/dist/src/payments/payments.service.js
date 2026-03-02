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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const count = await this.prisma.payment.count();
        const receiptNumber = `RCP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const payment = await this.prisma.payment.create({
            data: {
                studentId: data.studentId,
                studentFeeId: data.studentFeeId,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                transactionRef: data.transactionRef,
                receiptNumber,
                status: 'COMPLETED',
                collectedBy: data.collectedBy,
                notes: data.notes,
            },
        });
        if (data.studentFeeId) {
            const fee = await this.prisma.studentFee.findUnique({
                where: { id: data.studentFeeId },
                include: { payments: true },
            });
            if (fee) {
                const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
                let newStatus = 'PARTIAL';
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
    async findAll(studentId) {
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
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                student: true,
                studentFee: { include: { feeItem: true } },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async findByReceipt(receiptNumber) {
        const payment = await this.prisma.payment.findUnique({
            where: { receiptNumber },
            include: {
                student: true,
                studentFee: { include: { feeItem: true } },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException('Receipt not found');
        return payment;
    }
    async getStudentPaymentHistory(studentId) {
        return this.prisma.payment.findMany({
            where: { studentId },
            include: {
                studentFee: { include: { feeItem: true } },
            },
            orderBy: { paymentDate: 'desc' },
        });
    }
    async getTotalCollected(startDate, endDate) {
        const where = {
            status: 'COMPLETED',
        };
        if (startDate || endDate) {
            where.paymentDate = {};
            if (startDate)
                where.paymentDate.gte = startDate;
            if (endDate)
                where.paymentDate.lte = endDate;
        }
        const payments = await this.prisma.payment.findMany({ where });
        return payments.reduce((sum, p) => sum + p.amount, 0);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map