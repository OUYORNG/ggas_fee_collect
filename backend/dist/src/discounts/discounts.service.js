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
exports.DiscountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let DiscountsService = class DiscountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.discountType.create({ data });
    }
    async findAll(category) {
        const where = category ? { category: category } : {};
        return this.prisma.discountType.findMany({
            where,
            orderBy: { priority: 'asc' },
        });
    }
    async findOne(id) {
        const discount = await this.prisma.discountType.findUnique({ where: { id } });
        if (!discount)
            throw new common_1.NotFoundException('Discount type not found');
        return discount;
    }
    async update(id, data) {
        return this.prisma.discountType.update({ where: { id }, data });
    }
    async remove(id) {
        await this.prisma.discountType.delete({ where: { id } });
    }
    async getStackableDiscounts() {
        return this.prisma.discountType.findMany({
            where: { stackable: true, isActive: true },
            orderBy: { priority: 'asc' },
        });
    }
};
exports.DiscountsService = DiscountsService;
exports.DiscountsService = DiscountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscountsService);
//# sourceMappingURL=discounts.service.js.map