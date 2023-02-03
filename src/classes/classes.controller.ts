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
import { CurrentUser } from '../auth/decorators';
import { AdminGuard } from '../guards/admin.guard';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dtos';

@Controller('classes')
export class ClassesController {
  constructor(private clsService: ClassesService) {}

  @UseGuards(AdminGuard)
  @Post('/new')
  createStudent(@Body() body: CreateClassDto) {
    return this.clsService.createClass(body);
  }

  @Get()
  getClasses() {
    return this.clsService.getClasses();
  }

  // TODO: test this map
  @Get('/classes')
  getClassesByTeacher(@CurrentUser('sub') id: string) {
    return this.clsService.getClassesByTeacher(id);
  }

  @Get('/:id')
  getStudent(@Param('id') id: string) {
    return this.clsService.getClass(id);
  }

  @Delete('/:id')
  deleteStudent(@Param('id') id: string) {
    return this.clsService.deleteClass(id);
  }

  @Patch('/:id')
  updateStudent(@Param('id') id: string, student: Partial<CreateClassDto>) {
    return this.clsService.updateClass(id, student);
  }
}
