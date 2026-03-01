import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, Voucher, VoucherTypeEnum } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.VoucherCreateInput): Promise<Voucher> {
    return this.prisma.voucher.create({ data });
  }

  async findAll(active?: boolean) {
    const where = active !== undefined ? { isActive: active } : {};
    return this.prisma.voucher.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Voucher> {
    const voucher = await this.prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return this.prisma.voucher.findUnique({ where: { code } });
  }

  async update(id: string, data: Prisma.VoucherUpdateInput): Promise<Voucher> {
    return this.prisma.voucher.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.voucher.delete({ where: { id } });
  }

  async validate(code: string) {
    const voucher = await this.findByCode(code);
    
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    if (!voucher.isActive) {
      throw new BadRequestException('Voucher is inactive');
    }

    const now = new Date();
    if (voucher.validFrom && now < voucher.validFrom) {
      throw new BadRequestException('Voucher not yet valid');
    }
    if (voucher.validTo && now > voucher.validTo) {
      throw new BadRequestException('Voucher expired');
    }
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Voucher usage limit reached');
    }

    return {
      valid: true,
      voucher: {
        code: voucher.code,
        name: voucher.name,
        type: voucher.type,
        value: voucher.value,
        targetCategory: voucher.targetCategory,
        remainingUses: voucher.usageLimit ? voucher.usageLimit - voucher.usedCount : null,
      }
    };
  }
}
