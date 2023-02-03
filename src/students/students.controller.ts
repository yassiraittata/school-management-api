import {
  Controller,
  Body,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private stdService: StudentsService) {}

  @UseGuards(AdminGuard)
  @Post('/new')
  createStudent(@Body() body: CreateStudentDto) {
    console.log('student controller');
    return this.stdService.createStudent(body);
  }

  @Get()
  getStudents() {
    return this.stdService.getStudents();
  }

  // TODO test this one as well
  // *works like magic
  @Get()
  getStudentsByClass(@Query('class') classId: string) {
    return this.stdService.getStudentsByClass(classId);
  }

  @Get('/:id')
  getStudent(@Param('id') id: string) {
    return this.stdService.getStudent(id);
  }

  @Delete('/:id')
  deleteStudent(@Param('id') id: string) {
    return this.stdService.deleteStudent(id);
  }

  @Patch('/:id')
  updateStudent(@Param('id') id: string, student: Partial<CreateStudentDto>) {
    return this.stdService.updateStudent(id, student);
  }
}
