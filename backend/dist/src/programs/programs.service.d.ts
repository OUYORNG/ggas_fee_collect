import { Prisma, Program } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
export declare class ProgramsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProgramCreateInput): Promise<Program>;
    findAll(gradeId?: string): Promise<({
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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        curriculum: string;
        type: string;
        language: string;
        gradeId: string | null;
    })[]>;
    findOne(id: string): Promise<Program>;
    update(id: string, data: Prisma.ProgramUpdateInput): Promise<Program>;
    remove(id: string): Promise<void>;
    getTuition(programId: string, periodType: string): Promise<{
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
        tuition: {
            term: number;
            semester: number;
            year: number;
        };
    }>;
}
