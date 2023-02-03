import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateClassDto } from './dtos';

@Injectable()
export class ClassesService {
  constructor(private db: DbService) {}

  async createClass(body: CreateClassDto) {
    return this.db.classroom.create({
      data: { title: body.title, teacherId: body.teacherId },
    });
  }

  getClasses() {}

  async getClassesByTeacher(id: string) {
    const classes = await this.db.classroom.findMany({
      where: {
        teacherId: id,
      },
    });

    return classes;
  }

  async getClass(id: string) {
    const teacher = await this.db.classroom.findFirst({
      where: {
        id: id,
      },
    });

    if (!teacher) {
      throw new BadRequestException('No class found');
    }

    return teacher;
  }

  async deleteClass(id: string) {
    return await this.db.classroom.delete({
      where: {
        id: id,
      },
    });
  }

  async updateClass(id: string, attrs: Partial<CreateClassDto>) {
    const teacher = await this.db.classroom.findUnique({
      where: {
        id: id,
      },
    });

    if (!teacher) {
      throw new BadRequestException('no stident found');
    }

    Object.assign(teacher, attrs);

    return await this.db.classroom.update({
      where: { id: id },
      data: {
        ...teacher,
      },
    });
  }
}
