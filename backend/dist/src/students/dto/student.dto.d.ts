export declare class CreateStudentDto {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    gradeId?: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail?: string;
    guardianRelation: string;
    address?: string;
    notes?: string;
    familyId?: string;
}
export declare class UpdateStudentDto {
    firstName?: string;
    lastName?: string;
    gender?: string;
    dob?: string;
    gradeId?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    guardianRelation?: string;
    address?: string;
    notes?: string;
    status?: string;
    familyId?: string;
}
export declare class StudentQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    gradeId?: string;
}
