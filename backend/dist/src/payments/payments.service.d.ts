import { Payment } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        studentId: string;
        studentFeeId?: string;
        amount: number;
        paymentMethod: string;
        transactionRef?: string;
        collectedBy?: string;
        notes?: string;
    }): Promise<Payment>;
    findAll(studentId?: string): Promise<({
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            gradeId: string | null;
            studentId: string;
            firstName: string;
            lastName: string;
            fullName: string;
            gender: string;
            dob: Date;
            photoUrl: string | null;
            enrollmentDate: Date;
            status: import(".prisma/client").$Enums.StudentStatus;
            guardianName: string;
            guardianPhone: string;
            guardianEmail: string | null;
            guardianRelation: string;
            address: string | null;
            notes: string | null;
            familyId: string | null;
        };
        studentFee: {
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
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<Payment>;
    findByReceipt(receiptNumber: string): Promise<Payment>;
    getStudentPaymentHistory(studentId: string): Promise<({
        studentFee: {
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
        };
    } & {
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
    })[]>;
    getTotalCollected(startDate?: Date, endDate?: Date): Promise<number>;
}
