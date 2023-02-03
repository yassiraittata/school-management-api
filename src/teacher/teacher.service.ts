import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTeacherDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService {
  constructor(private db: DbService) {}

  async createTeacher(body: CreateTeacherDto) {
    const hash = await bcrypt.hash(body.password, 12);

    return this.db.teacher.create({
      data: {
        fullname: body.fullname,
        email: body.email,
        password: hash,
        rt: null,
        role: 'user',
      },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });
  }

  getTeachers() {}

  async getTeacher(id: string) {
    const teacher = await this.db.teacher.findFirst({
      where: {
        id: id,
      },
    });

    if (!teacher) {
      throw new BadRequestException('No teacher found');
    }

    return teacher;
  }

  async deleteTeacher(id: string) {
    return await this.db.teacher.delete({
      where: {
        id: id,
      },
    });
  }

  async updateTeacher(id: string, attrs: Partial<CreateTeacherDto>) {
    const teacher = await this.db.teacher.findUnique({
      where: {
        id: id,
      },
    });

    if (!teacher) {
      throw new BadRequestException('no teacer found');
    }

    Object.assign(teacher, attrs);

    return await this.db.student.update({
      where: { id: id },
      data: {
        ...teacher,
      },
    });
  }
}
