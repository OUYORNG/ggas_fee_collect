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
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let ProgramsService = class ProgramsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.program.create({ data });
    }
    async findAll(gradeId) {
        const where = gradeId ? { gradeId } : {};
        return this.prisma.program.findMany({
            where,
            include: { grade: true },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const program = await this.prisma.program.findUnique({
            where: { id },
            include: { grade: true },
        });
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        return program;
    }
    async update(id, data) {
        return this.prisma.program.update({ where: { id }, data });
    }
    async remove(id) {
        await this.prisma.program.delete({ where: { id } });
    }
    async getTuition(programId, periodType) {
        const program = await this.findOne(programId);
        return {
            program,
            tuition: {
                term: program.code.includes('TERM') ? 0 : 0,
                semester: 0,
                year: 0,
            }
        };
    }
};
exports.ProgramsService = ProgramsService;
exports.ProgramsService = ProgramsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgramsService);
//# sourceMappingURL=programs.service.js.map