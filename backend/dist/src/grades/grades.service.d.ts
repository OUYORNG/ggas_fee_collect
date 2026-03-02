import { Prisma, Grade } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
export declare class GradesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.GradeCreateInput): Promise<Grade>;
    findAll(): Promise<({
        nextGrade: {
            id: string;
            name: string;
            level: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            nextGradeId: string | null;
        };
        programs: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculum: string;
            type: string;
            language: string;
            gradeId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        level: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        nextGradeId: string | null;
    })[]>;
    findOne(id: string): Promise<Grade>;
    update(id: string, data: Prisma.GradeUpdateInput): Promise<Grade>;
    remove(id: string): Promise<void>;
    getNextGrade(gradeId: string): Promise<Grade | null>;
    promoteStudent(studentId: string): Promise<Grade>;
    setPromotion(fromGradeId: string, toGradeId: string): Promise<Grade>;
}
