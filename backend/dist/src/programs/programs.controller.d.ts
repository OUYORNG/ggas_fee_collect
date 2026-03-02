import { ProgramsService } from './programs.service';
export declare class ProgramsController {
    private readonly service;
    constructor(service: ProgramsService);
    create(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        curriculum: string;
        type: string;
        language: string;
        gradeId: string | null;
    }>;
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
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        curriculum: string;
        type: string;
        language: string;
        gradeId: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        curriculum: string;
        type: string;
        language: string;
        gradeId: string | null;
    }>;
    remove(id: string): Promise<void>;
}
