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
exports.VouchersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let VouchersService = class VouchersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.voucher.create({ data });
    }
    async findAll(active) {
        const where = active !== undefined ? { isActive: active } : {};
        return this.prisma.voucher.findMany({ where, orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        const voucher = await this.prisma.voucher.findUnique({ where: { id } });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher not found');
        return voucher;
    }
    async findByCode(code) {
        return this.prisma.voucher.findUnique({ where: { code } });
    }
    async update(id, data) {
        return this.prisma.voucher.update({ where: { id }, data });
    }
    async remove(id) {
        await this.prisma.voucher.delete({ where: { id } });
    }
    async validate(code) {
        const voucher = await this.findByCode(code);
        if (!voucher) {
            throw new common_1.NotFoundException('Voucher not found');
        }
        if (!voucher.isActive) {
            throw new common_1.BadRequestException('Voucher is inactive');
        }
        const now = new Date();
        if (voucher.validFrom && now < voucher.validFrom) {
            throw new common_1.BadRequestException('Voucher not yet valid');
        }
        if (voucher.validTo && now > voucher.validTo) {
            throw new common_1.BadRequestException('Voucher expired');
        }
        if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
            throw new common_1.BadRequestException('Voucher usage limit reached');
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
};
exports.VouchersService = VouchersService;
exports.VouchersService = VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VouchersService);
//# sourceMappingURL=vouchers.service.js.map