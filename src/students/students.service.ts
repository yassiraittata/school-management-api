import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

import { CreateStudentDto } from './dtos/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private db: DbService) {}

  async createStudent(body: CreateStudentDto) {
    const student = await this.db.student.findUnique({
      where: {
        email: body.email,
      },
    });

    if (student) {
      throw new BadRequestException('Email in use');
    }

    const newStudent = await this.db.student.create({
      data: {
        fullname: body.fullname,
        email: body.email,
        birthday: body.birthday,
        phone: body.phone,
        Classroom: {
          connect: {
            id: body.classroomId,
          },
        },
      },
    });

    return newStudent;
  }

  async getStudents() {
    const students = await this.db.student.findMany();

    return students;
  }

  async getStudentsByClass(id: string) {
    const students = await this.db.student.findMany({
      where: {
        classroomId: id,
      },
    });

    return students;
  }

  async getStudent(id: string) {
    const student = await this.db.student.findFirst({
      where: {
        id: id,
      },
    });

    if (!student) {
      throw new BadRequestException('No student found');
    }

    return student;
  }

  async deleteStudent(id: string) {
    return await this.db.student.delete({
      where: {
        id: id,
      },
    });
  }

  async updateStudent(id: string, atttr: Partial<CreateStudentDto>) {
    const student = await this.db.student.findUnique({
      where: {
        id: id,
      },
    });

    if (!student) {
      throw new BadRequestException('no stident found');
    }

    Object.assign(student, atttr);

    return await this.db.student.update({
      where: { id: id },
      data: {
        ...student,
      },
    });
  }
}
