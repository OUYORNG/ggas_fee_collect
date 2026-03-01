import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Grade } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.GradeCreateInput): Promise<Grade> {
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

  async findOne(id: string): Promise<Grade> {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
      include: { nextGrade: true, programs: true },
    });
    if (!grade) throw new NotFoundException('Grade not found');
    return grade;
  }

  async update(id: string, data: Prisma.GradeUpdateInput): Promise<Grade> {
    return this.prisma.grade.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.grade.delete({ where: { id } });
  }

  // Get next grade for promotion
  async getNextGrade(gradeId: string): Promise<Grade | null> {
    const grade = await this.prisma.grade.findUnique({
      where: { id: gradeId },
      include: { nextGrade: true },
    });
    return grade?.nextGrade || null;
  }

  // Promote student to next grade
  async promoteStudent(studentId: string): Promise<Grade> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { grade: { include: { nextGrade: true } } },
    });

    if (!student?.grade?.nextGrade) {
      throw new NotFoundException('No next grade available for promotion');
    }

    return this.prisma.student.update({
      where: { id: studentId },
      data: { grade: { connect: { id: student.grade.nextGrade.id } } },
    }).then(s => s as any);
  }

  // Set class progression
  async setPromotion(fromGradeId: string, toGradeId: string): Promise<Grade> {
    return this.prisma.grade.update({
      where: { id: fromGradeId },
      data: { nextGrade: { connect: { id: toGradeId } } },
    });
  }
}
