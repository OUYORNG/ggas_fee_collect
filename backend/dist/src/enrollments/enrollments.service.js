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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.enrollment.findUnique({
            where: {
                studentId_programId_periodId: {
                    studentId: data.studentId,
                    programId: data.programId,
                    periodId: data.periodId,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Student already enrolled in this program for this period');
        }
        return this.prisma.enrollment.create({
            data: {
                studentId: data.studentId,
                programId: data.programId,
                periodId: data.periodId,
                academicYear: data.academicYear,
                status: 'ENROLLED',
            },
        });
    }
    async findAll(studentId, periodId) {
        const where = {};
        if (studentId)
            where.studentId = studentId;
        if (periodId)
            where.periodId = periodId;
        return this.prisma.enrollment.findMany({
            where,
            include: {
                student: true,
                program: true,
                period: true,
                studentFees: true,
            },
            orderBy: { enrolledAt: 'desc' },
        });
    }
    async findOne(id) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id },
            include: {
                student: true,
                program: true,
                period: true,
                studentFees: { include: { feeItem: true } },
            },
        });
        if (!enrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        return enrollment;
    }
    async updateStatus(id, status) {
        return this.prisma.enrollment.update({
            where: { id },
            data: { status: status },
        });
    }
    async getStudentEnrollments(studentId) {
        return this.prisma.enrollment.findMany({
            where: { studentId },
            include: {
                program: true,
                period: true,
                studentFees: { include: { feeItem: true } },
            },
            orderBy: { enrolledAt: 'desc' },
        });
    }
    async checkPromotion(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                grade: { include: { nextGrade: true } }
            },
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const currentPeriod = await this.prisma.period.findFirst({
            where: {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
        });
        if (!currentPeriod)
            return { eligible: false, reason: 'No current period found' };
        const nextPeriod = await this.prisma.period.findFirst({
            where: {
                academicYear: currentPeriod.academicYear,
                startDate: { gt: currentPeriod.endDate },
            },
        });
        const hasNextGrade = student.grade?.nextGradeId !== null;
        const isEnrolled = await this.prisma.enrollment.findFirst({
            where: {
                studentId,
                periodId: nextPeriod?.id,
            },
        });
        return {
            eligible: hasNextGrade && !isEnrolled,
            currentGrade: student.grade?.name,
            nextGrade: student.grade?.nextGrade?.name,
            nextPeriod: nextPeriod?.name,
        };
    }
    async promoteStudent(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                grade: {
                    include: {
                        nextGrade: { include: { programs: true } }
                    }
                },
                enrollments: true
            },
        });
        if (!student?.grade?.nextGrade) {
            throw new common_1.BadRequestException('No next grade available for promotion');
        }
        await this.prisma.student.update({
            where: { id: studentId },
            data: { grade: { connect: { id: student.grade.nextGrade.id } } },
        });
        const nextPeriod = await this.prisma.period.findFirst({
            where: {
                startDate: { gt: new Date() },
            },
            orderBy: { startDate: 'asc' },
        });
        if (nextPeriod && student.grade.nextGrade.programs.length > 0) {
            const nextProgram = student.grade.nextGrade.programs[0];
            await this.prisma.enrollment.create({
                data: {
                    studentId,
                    programId: nextProgram.id,
                    periodId: nextPeriod.id,
                    academicYear: nextPeriod.academicYear,
                    promotedFromId: student.enrollments?.[0]?.id,
                    status: 'PROMOTED',
                },
            });
        }
        return {
            success: true,
            newGrade: student.grade.nextGrade.name,
        };
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map