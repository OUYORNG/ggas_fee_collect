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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let StudentsService = class StudentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const count = await this.prisma.student.count();
        const studentId = `STU-${String(count + 1).padStart(4, '0')}`;
        return this.prisma.student.create({
            data: {
                studentId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                fullName: `${dto.firstName} ${dto.lastName}`,
                gender: dto.gender,
                dob: new Date(dto.dob),
                gradeId: dto.gradeId,
                guardianName: dto.guardianName,
                guardianPhone: dto.guardianPhone,
                guardianEmail: dto.guardianEmail,
                guardianRelation: dto.guardianRelation,
                address: dto.address,
                notes: dto.notes,
                familyId: dto.familyId,
            },
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, status, gradeId } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { studentId: { contains: search, mode: 'insensitive' } },
                { guardianName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (gradeId) {
            where.gradeId = gradeId;
        }
        const [students, total] = await Promise.all([
            this.prisma.student.findMany({
                where,
                skip,
                take: limit,
                include: {
                    grade: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.student.count({ where }),
        ]);
        return {
            data: students,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                grade: true,
                enrollments: {
                    include: {
                        program: true,
                        period: true,
                    },
                },
                studentFees: {
                    include: {
                        feeItem: true,
                        period: true,
                    },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }
    async findByStudentId(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { studentId },
            include: {
                grade: true,
            },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        return student;
    }
    async update(id, dto) {
        const data = {};
        if (dto.firstName)
            data.firstName = dto.firstName;
        if (dto.lastName)
            data.lastName = dto.lastName;
        if (dto.firstName || dto.lastName) {
            const student = await this.prisma.student.findUnique({ where: { id } });
            data.fullName = `${dto.firstName || student.firstName} ${dto.lastName || student.lastName}`;
        }
        if (dto.gender)
            data.gender = dto.gender;
        if (dto.dob)
            data.dob = new Date(dto.dob);
        if (dto.gradeId !== undefined)
            data.grade = { connect: { id: dto.gradeId } };
        if (dto.guardianName)
            data.guardianName = dto.guardianName;
        if (dto.guardianPhone)
            data.guardianPhone = dto.guardianPhone;
        if (dto.guardianEmail !== undefined)
            data.guardianEmail = dto.guardianEmail;
        if (dto.guardianRelation)
            data.guardianRelation = dto.guardianRelation;
        if (dto.address !== undefined)
            data.address = dto.address;
        if (dto.notes !== undefined)
            data.notes = dto.notes;
        if (dto.status)
            data.status = dto.status;
        if (dto.familyId !== undefined)
            data.familyId = dto.familyId;
        return this.prisma.student.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.prisma.student.delete({ where: { id } });
    }
    async getSiblings(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            select: { familyId: true },
        });
        if (!student?.familyId) {
            return [];
        }
        return this.prisma.student.findMany({
            where: {
                familyId: student.familyId,
                id: { not: studentId },
            },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map