import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    // Generate student ID
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

  async findAll(query: StudentQueryDto) {
    const { page = 1, limit = 10, search, status, gradeId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } },
        { guardianName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status as any;
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

  async findOne(id: string): Promise<Student> {
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
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { studentId },
      include: {
        grade: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const data: Prisma.StudentUpdateInput = {};

    if (dto.firstName) data.firstName = dto.firstName;
    if (dto.lastName) data.lastName = dto.lastName;
    if (dto.firstName || dto.lastName) {
      const student = await this.prisma.student.findUnique({ where: { id } });
      data.fullName = `${dto.firstName || student.firstName} ${dto.lastName || student.lastName}`;
    }
    if (dto.gender) data.gender = dto.gender;
    if (dto.dob) data.dob = new Date(dto.dob);
    if (dto.gradeId !== undefined) data.grade = { connect: { id: dto.gradeId } };
    if (dto.guardianName) data.guardianName = dto.guardianName;
    if (dto.guardianPhone) data.guardianPhone = dto.guardianPhone;
    if (dto.guardianEmail !== undefined) data.guardianEmail = dto.guardianEmail;
    if (dto.guardianRelation) data.guardianRelation = dto.guardianRelation;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.status) data.status = dto.status as any;
    if (dto.familyId !== undefined) data.familyId = dto.familyId;

    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.student.delete({ where: { id } });
  }

  // Get siblings by family ID
  async getSiblings(studentId: string) {
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
}
