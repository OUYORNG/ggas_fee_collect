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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let GradesService = class GradesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.grade.create({ data });
    }
    async findAll() {
        return this.prisma.grade.findMany({
            include: {
                nextGrade: true,
                programs: true,
            },
            orderBy: { level: 'asc' },
        });
    }
    async findOne(id) {
        const grade = await this.prisma.grade.findUnique({
            where: { id },
            include: { nextGrade: true, programs: true },
        });
        if (!grade)
            throw new common_1.NotFoundException('Grade not found');
        return grade;
    }
    async update(id, data) {
        return this.prisma.grade.update({ where: { id }, data });
    }
    async remove(id) {
        await this.prisma.grade.delete({ where: { id } });
    }
    async getNextGrade(gradeId) {
        const grade = await this.prisma.grade.findUnique({
            where: { id: gradeId },
            include: { nextGrade: true },
        });
        return grade?.nextGrade || null;
    }
    async promoteStudent(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { grade: { include: { nextGrade: true } } },
        });
        if (!student?.grade?.nextGrade) {
            throw new common_1.NotFoundException('No next grade available for promotion');
        }
        return this.prisma.student.update({
            where: { id: studentId },
            data: { grade: { connect: { id: student.grade.nextGrade.id } } },
        }).then(s => s);
    }
    async setPromotion(fromGradeId, toGradeId) {
        return this.prisma.grade.update({
            where: { id: fromGradeId },
            data: { nextGrade: { connect: { id: toGradeId } } },
        });
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map