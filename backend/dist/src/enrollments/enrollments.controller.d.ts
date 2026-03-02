import { EnrollmentsService } from './enrollments.service';
export declare class EnrollmentsController {
    private readonly service;
    constructor(service: EnrollmentsService);
    create(data: any): Promise<{
        id: string;
        academicYear: string;
        programId: string;
        studentId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        promotedFromId: string | null;
        enrolledAt: Date;
        periodId: string;
    }>;
    findAll(studentId?: string, periodId?: string): Promise<({
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
        studentFees: {
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
        }[];
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
    } & {
        id: string;
        academicYear: string;
        programId: string;
        studentId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        promotedFromId: string | null;
        enrolledAt: Date;
        periodId: string;
    })[]>;
    getStudentEnrollments(studentId: string): Promise<({
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
        studentFees: ({
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
        })[];
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
    } & {
        id: string;
        academicYear: string;
        programId: string;
        studentId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        promotedFromId: string | null;
        enrolledAt: Date;
        periodId: string;
    })[]>;
    checkPromotion(studentId: string): Promise<{
        eligible: boolean;
        reason: string;
        currentGrade?: undefined;
        nextGrade?: undefined;
        nextPeriod?: undefined;
    } | {
        eligible: boolean;
        currentGrade: string;
        nextGrade: string;
        nextPeriod: string;
        reason?: undefined;
    }>;
    promoteStudent(studentId: string): Promise<{
        success: boolean;
        newGrade: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        academicYear: string;
        programId: string;
        studentId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        promotedFromId: string | null;
        enrolledAt: Date;
        periodId: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        academicYear: string;
        programId: string;
        studentId: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        promotedFromId: string | null;
        enrolledAt: Date;
        periodId: string;
    }>;
}
