import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { StudentsModule } from './students/students.module';
import { ProgramsModule } from './programs/programs.module';
import { GradesModule } from './grades/grades.module';
import { FeesModule } from './fees/fees.module';
import { DiscountsModule } from './discounts/discounts.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { PaymentsModule } from './payments/payments.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    CommonModule,
    StudentsModule,
    ProgramsModule,
    GradesModule,
    FeesModule,
    DiscountsModule,
    VouchersModule,
    PaymentsModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}
