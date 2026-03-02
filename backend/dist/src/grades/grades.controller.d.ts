import { GradesService } from './grades.service';
export declare class GradesController {
    private readonly service;
    constructor(service: GradesService);
    create(data: any): Promise<{
        id: string;
        name: string;
        level: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        nextGradeId: string | null;
    }>;
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
    findOne(id: string): Promise<{
        id: string;
        name: string;
        level: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        nextGradeId: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        level: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        nextGradeId: string | null;
    }>;
    remove(id: string): Promise<void>;
    getNextGrade(id: string): Promise<{
        id: string;
        name: string;
        level: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        nextGradeId: string | null;
    }>;
    promoteStudent(studentId: string): Promise<{
        id: string;
        name: string;
        level: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        nextGradeId: string | null;
    }>;
    setPromotion(body: {
        fromGradeId: string;
        toGradeId: string;
    }): Promise<{
        id: string;
        name: string;
        level: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        nextGradeId: string | null;
    }>;
}
