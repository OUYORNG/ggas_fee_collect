import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, DiscountType, DiscountCategory, DiscountTypeEnum } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DiscountTypeCreateInput): Promise<DiscountType> {
    return this.prisma.discountType.create({ data });
  }

  async findAll(category?: string) {
    const where = category ? { category: category as DiscountCategory } : {};
    return this.prisma.discountType.findMany({
      where,
      orderBy: { priority: 'asc' },
    });
  }

  async findOne(id: string): Promise<DiscountType> {
    const discount = await this.prisma.discountType.findUnique({ where: { id } });
    if (!discount) throw new NotFoundException('Discount type not found');
    return discount;
  }

  async update(id: string, data: Prisma.DiscountTypeUpdateInput): Promise<DiscountType> {
    return this.prisma.discountType.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.discountType.delete({ where: { id } });
  }

  async getStackableDiscounts() {
    return this.prisma.discountType.findMany({
      where: { stackable: true, isActive: true },
      orderBy: { priority: 'asc' },
    });
  }
}
