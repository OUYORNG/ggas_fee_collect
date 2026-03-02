import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, Enrollment, EnrollmentStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    studentId: string;
    programId: string;
    periodId: string;
    academicYear: string;
  }): Promise<Enrollment> {
    // Check if already enrolled
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
      throw new BadRequestException('Student already enrolled in this program for this period');
    }

    return this.prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        programId: data.programId,
        periodId: data.periodId,
        academicYear: data.academicYear,
        status: 'ENROLLED' as EnrollmentStatus,
      },
    });
  }

  async findAll(studentId?: string, periodId?: string) {
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (periodId) where.periodId = periodId;

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

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
        program: true,
        period: true,
        studentFees: { include: { feeItem: true } },
      },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return enrollment;
  }

  async updateStatus(id: string, status: string): Promise<Enrollment> {
    return this.prisma.enrollment.update({
      where: { id },
      data: { status: status as EnrollmentStatus },
    });
  }

  async getStudentEnrollments(studentId: string) {
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

  // Check enrollment for next period and promote
  async checkPromotion(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { 
        grade: { include: { nextGrade: true } } 
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    // Get next period
    const currentPeriod = await this.prisma.period.findFirst({
      where: {
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    if (!currentPeriod) return { eligible: false, reason: 'No current period found' };

    // Find next period
    const nextPeriod = await this.prisma.period.findFirst({
      where: {
        academicYear: currentPeriod.academicYear,
        startDate: { gt: currentPeriod.endDate },
      },
    });

    // Determine if eligible for promotion
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

  // Auto-promote student to next class
  async promoteStudent(studentId: string) {
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
      throw new BadRequestException('No next grade available for promotion');
    }

    // Update student grade
    await this.prisma.student.update({
      where: { id: studentId },
      data: { grade: { connect: { id: student.grade.nextGrade.id } } },
    });

    // Create new enrollment for next period (if exists)
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
}
