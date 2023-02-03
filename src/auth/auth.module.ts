import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbService } from '../db/db.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrattegy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrattegy, RtStrategy],
})
export class AuthModule {}
