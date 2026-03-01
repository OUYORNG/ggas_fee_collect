import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeesService } from './fees.service';

@ApiTags('fees')
@Controller('fees')
export class FeesController {
  constructor(private readonly service: FeesService) {}

  // Fee Items
  @Post('items')
  createFeeItem(@Body() data: any) { return this.service.createFeeItem(data); }

  @Get('items')
  findAllFeeItems(@Query('category') category?: string) { return this.service.findAllFeeItems(category); }

  @Get('items/:id')
  findFeeItem(@Param('id') id: string) { return this.service.findFeeItem(id); }

  @Put('items/:id')
  updateFeeItem(@Param('id') id: string, @Body() data: any) { return this.service.updateFeeItem(id, data); }

  @Delete('items/:id')
  deleteFeeItem(@Param('id') id: string) { return this.service.deleteFeeItem(id); }

  // Student Fees
  @Post('generate')
  generateStudentFees(@Body() body: { studentId: string; periodId: string }) { 
    return this.service.generateStudentFees(body.studentId, body.periodId); 
  }

  @Post('calculate')
  calculateFee(
    @Body() body: { 
      studentFeeId: string; 
      applySiblingDiscount?: boolean;
      applyEarlyPaymentDiscount?: boolean;
      applyFullYearDiscount?: boolean;
      applyOutstandingDiscount?: boolean;
      applyStaffDiscount?: boolean;
      scholarshipDiscount?: number;
      voucherCode?: string;
    }
  ) { return this.service.calculateFee(body.studentFeeId, body); }

  @Get('student/:studentId')
  getStudentFees(@Param('studentId') studentId: string, @Query('status') status?: string) { 
    return this.service.getStudentFees(studentId, status); 
  }

  @Post('apply-discount')
  applyDiscount(@Body() body: { studentFeeId: string; discountTypeId: string; notes?: string }) { 
    return this.service.applyDiscount(body.studentFeeId, body.discountTypeId, body.notes); 
  }
}
