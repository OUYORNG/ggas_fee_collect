import { VouchersService } from './vouchers.service';
export declare class VouchersController {
    private readonly service;
    constructor(service: VouchersService);
    create(data: any): Promise<{
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
    }>;
    findAll(active?: string): Promise<{
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
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, data: any): Promise<{
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
    }>;
    remove(id: string): Promise<void>;
}
