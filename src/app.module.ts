import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { AtGuard } from './auth/guards';
import { StudentsModule } from './students/students.module';
import { AdminGuard } from './guards/admin.guard';
import { TeacherModule } from './teacher/teacher.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [AuthModule, DbModule, StudentsModule, TeacherModule, ClassesModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
