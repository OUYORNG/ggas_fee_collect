import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Get()
  findAll(@Query('studentId') studentId?: string, @Query('periodId') periodId?: string) { 
    return this.service.findAll(studentId, periodId); 
  }

  @Get('student/:studentId')
  getStudentEnrollments(@Param('studentId') studentId: string) { 
    return this.service.getStudentEnrollments(studentId); 
  }

  @Get('promotion/check/:studentId')
  checkPromotion(@Param('studentId') studentId: string) { 
    return this.service.checkPromotion(studentId); 
  }

  @Post('promote/:studentId')
  promoteStudent(@Param('studentId') studentId: string) { 
    return this.service.promoteStudent(studentId); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) { 
    return this.service.updateStatus(id, status); 
  }
}
