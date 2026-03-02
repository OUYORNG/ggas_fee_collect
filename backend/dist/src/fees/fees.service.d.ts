import { Prisma, FeeItem } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
export declare class FeesService {
    private prisma;
    constructor(prisma: PrismaService);
    createFeeItem(data: Prisma.FeeItemCreateInput): Promise<FeeItem>;
    findAllFeeItems(category?: string): Promise<({
        grade: {
            id: string;
            name: string;
            level: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            nextGradeId: string | null;
        };
        program: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculum: string;
            type: string;
            language: string;
            gradeId: string | null;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        gradeId: string | null;
        category: import(".prisma/client").$Enums.FeeCategory;
        amount: number;
        periodType: string | null;
        isRequired: boolean;
        isRecurring: boolean;
        dueDate: Date | null;
        validFrom: Date | null;
        validTo: Date | null;
        programId: string | null;
    })[]>;
    findFeeItem(id: string): Promise<FeeItem>;
    updateFeeItem(id: string, data: Prisma.FeeItemUpdateInput): Promise<FeeItem>;
    deleteFeeItem(id: string): Promise<void>;
    generateStudentFees(studentId: string, periodId: string): Promise<any[]>;
    calculateFee(studentFeeId: string, options: {
        applySiblingDiscount?: boolean;
        applyEarlyPaymentDiscount?: boolean;
        applyFullYearDiscount?: boolean;
        applyOutstandingDiscount?: boolean;
        applyStaffDiscount?: boolean;
        scholarshipDiscount?: number;
        voucherCode?: string;
    }): Promise<{
        baseAmount: number;
        discounts: any[];
        totalDiscount: number;
        voucher: any[];
        totalVoucher: number;
        finalTotal: number;
    }>;
    getStudentFees(studentId: string, status?: string): Promise<({
        period: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            durationMonths: number;
            academicYear: string;
            startDate: Date;
            endDate: Date;
        };
        feeItem: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            gradeId: string | null;
            category: import(".prisma/client").$Enums.FeeCategory;
            amount: number;
            periodType: string | null;
            isRequired: boolean;
            isRecurring: boolean;
            dueDate: Date | null;
            validFrom: Date | null;
            validTo: Date | null;
            programId: string | null;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            studentId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            notes: string | null;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentDate: Date;
            transactionRef: string | null;
            receiptNumber: string | null;
            collectedBy: string | null;
            studentFeeId: string | null;
        }[];
        discounts: ({
            discountType: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                type: import(".prisma/client").$Enums.DiscountTypeEnum;
                category: import(".prisma/client").$Enums.DiscountCategory;
                validFrom: Date | null;
                validTo: Date | null;
                value: number;
                maxApplicable: number | null;
                stackable: boolean;
                priority: number;
                minQuantity: number | null;
                maxQuantity: number | null;
                isActive: boolean;
            };
        } & {
            id: string;
            studentId: string | null;
            notes: string | null;
            appliedBy: string | null;
            appliedAt: Date;
            studentFeeId: string;
            discountTypeId: string;
            appliedAmount: number;
        })[];
        vouchers: ({
            voucher: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                type: import(".prisma/client").$Enums.VoucherTypeEnum;
                validFrom: Date | null;
                validTo: Date | null;
                value: number;
                isActive: boolean;
                targetCategory: import(".prisma/client").$Enums.FeeCategory | null;
                usageLimit: number | null;
                usedCount: number;
            };
        } & {
            id: string;
            studentId: string | null;
            studentFeeId: string;
            appliedAmount: number;
            voucherId: string;
            usedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dueDate: Date | null;
        studentId: string;
        status: import(".prisma/client").$Enums.FeeStatus;
        periodId: string | null;
        baseAmount: number;
        discountAmount: number;
        voucherAmount: number;
        fineAmount: number;
        totalAmount: number;
        paidAt: Date | null;
        appliedBy: string | null;
        appliedAt: Date | null;
        enrollmentId: string | null;
        feeItemId: string;
    })[]>;
    applyDiscount(studentFeeId: string, discountTypeId: string, notes?: string): Promise<{
        id: string;
        studentId: string | null;
        notes: string | null;
        appliedBy: string | null;
        appliedAt: Date;
        studentFeeId: string;
        discountTypeId: string;
        appliedAmount: number;
    }>;
}
