import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GradesService } from './grades.service';

@ApiTags('grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Get(':id/next')
  getNextGrade(@Param('id') id: string) { return this.service.getNextGrade(id); }

  @Post(':id/promote')
  promoteStudent(@Param('id') studentId: string) { return this.service.promoteStudent(studentId); }

  @Post('promotion/set')
  setPromotion(@Body() body: { fromGradeId: string; toGradeId: string }) { 
    return this.service.setPromotion(body.fromGradeId, body.toGradeId); 
  }
}
