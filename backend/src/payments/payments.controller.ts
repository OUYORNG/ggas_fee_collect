import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Get()
  findAll(@Query('studentId') studentId?: string) { return this.service.findAll(studentId); }

  @Get('student/:studentId')
  getStudentPaymentHistory(@Param('studentId') studentId: string) { 
    return this.service.getStudentPaymentHistory(studentId); 
  }

  @Get('receipt/:receiptNumber')
  findByReceipt(@Param('receiptNumber') receiptNumber: string) { 
    return this.service.findByReceipt(receiptNumber); 
  }

  @Get('total')
  getTotalCollected(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) { 
    return this.service.getTotalCollected(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    ); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }
}
