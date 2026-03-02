"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("./common/common.module");
const students_module_1 = require("./students/students.module");
const programs_module_1 = require("./programs/programs.module");
const grades_module_1 = require("./grades/grades.module");
const fees_module_1 = require("./fees/fees.module");
const discounts_module_1 = require("./discounts/discounts.module");
const vouchers_module_1 = require("./vouchers/vouchers.module");
const payments_module_1 = require("./payments/payments.module");
const enrollments_module_1 = require("./enrollments/enrollments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            students_module_1.StudentsModule,
            programs_module_1.ProgramsModule,
            grades_module_1.GradesModule,
            fees_module_1.FeesModule,
            discounts_module_1.DiscountsModule,
            vouchers_module_1.VouchersModule,
            payments_module_1.PaymentsModule,
            enrollments_module_1.EnrollmentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map