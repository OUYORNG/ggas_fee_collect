import { Prisma, Voucher } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
export declare class VouchersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.VoucherCreateInput): Promise<Voucher>;
    findAll(active?: boolean): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        type: import(".prisma/client").$Enums.VoucherTypeEnum;
        validFrom: Date | null;
        validTo: Date | null;
        value: number;
        isActive: boolean;
        targetCategory: import(".prisma/client").$Enums.FeeCategory | null;
        usageLimit: number | null;
        usedCount: number;
    }[]>;
    findOne(id: string): Promise<Voucher>;
    findByCode(code: string): Promise<Voucher | null>;
    update(id: string, data: Prisma.VoucherUpdateInput): Promise<Voucher>;
    remove(id: string): Promise<void>;
    validate(code: string): Promise<{
        valid: boolean;
        voucher: {
            code: string;
            name: string;
            type: import(".prisma/client").$Enums.VoucherTypeEnum;
            value: number;
            targetCategory: import(".prisma/client").$Enums.FeeCategory;
            remainingUses: number;
        };
    }>;
}
