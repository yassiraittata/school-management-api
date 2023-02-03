import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { CreateTeacherDto } from './dtos';
import { TeacherService } from './teacher.service';

@UseGuards(AdminGuard)
@Controller('teachers')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Post('/new')
  createTeacher(@Body() body: CreateTeacherDto) {
    return this.teacherService.createTeacher(body);
  }

  @Get()
  getTeachers() {
    return this.teacherService.getTeachers();
  }

  @Get('/:id')
  getTeacher(@Param('id') id: string) {
    return this.teacherService.getTeacher(id);
  }

  @Delete('/:id')
  deleteTeacher(@Param('id') id: string) {
    return this.teacherService.deleteTeacher(id);
  }

  @Patch('/:id')
  updateTeacher(@Param('id') id: string, Teacher: Partial<CreateTeacherDto>) {
    return this.teacherService.updateTeacher(id, Teacher);
  }
}
