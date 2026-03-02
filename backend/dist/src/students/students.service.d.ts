import { Student } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto } from './dto/student.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateStudentDto): Promise<Student>;
    findAll(query: StudentQueryDto): Promise<{
        data: ({
            grade: {
                id: string;
                name: string;
                level: number;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                nextGradeId: string | null;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Student>;
    findByStudentId(studentId: string): Promise<Student>;
    update(id: string, dto: UpdateStudentDto): Promise<Student>;
    remove(id: string): Promise<void>;
    getSiblings(studentId: string): Promise<{
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
    }[]>;
}
