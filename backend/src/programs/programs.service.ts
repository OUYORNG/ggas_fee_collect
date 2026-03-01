import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Program } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProgramCreateInput): Promise<Program> {
    return this.prisma.program.create({ data });
  }

  async findAll(gradeId?: string) {
    const where = gradeId ? { gradeId } : {};
    return this.prisma.program.findMany({
      where,
      include: { grade: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Program> {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: { grade: true },
    });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async update(id: string, data: Prisma.ProgramUpdateInput): Promise<Program> {
    return this.prisma.program.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.program.delete({ where: { id } });
  }

  async getTuition(programId: string, periodType: string) {
    const program = await this.findOne(programId);
    // Return tuition for different period types
    return {
      program,
      tuition: {
        term: program.code.includes('TERM') ? 0 : 0, // Would fetch from fee_items
        semester: 0,
        year: 0,
      }
    };
  }
}
