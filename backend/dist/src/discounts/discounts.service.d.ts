import { Prisma, DiscountType } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
export declare class DiscountsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.DiscountTypeCreateInput): Promise<DiscountType>;
    findAll(category?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        type: import(".prisma/client").$Enums.DiscountTypeEnum;
        category: import(".prisma/client").$Enums.DiscountCategory;
        validFrom: Date | null;
        validTo: Date | null;
        value: number;
        maxApplicable: number | null;
        stackable: boolean;
        priority: number;
        minQuantity: number | null;
        maxQuantity: number | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<DiscountType>;
    update(id: string, data: Prisma.DiscountTypeUpdateInput): Promise<DiscountType>;
    remove(id: string): Promise<void>;
    getStackableDiscounts(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        type: import(".prisma/client").$Enums.DiscountTypeEnum;
        category: import(".prisma/client").$Enums.DiscountCategory;
        validFrom: Date | null;
        validTo: Date | null;
        value: number;
        maxApplicable: number | null;
        stackable: boolean;
        priority: number;
        minQuantity: number | null;
        maxQuantity: number | null;
        isActive: boolean;
    }[]>;
}
