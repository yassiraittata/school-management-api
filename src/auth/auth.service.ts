import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';

import { DbService } from '../db/db.service';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { jwtConstants } from './constants';
import { CreateUserDto, SigninDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private db: DbService, private jwt: JwtService) {}

  // TODO remove sign up method
  async signup(body: CreateUserDto) {
    const teacher = await this.db.teacher.findFirst({
      where: { email: body.email },
    });

    if (teacher) {
      throw new BadRequestException('Email already exists');
    }

    // const newUser = await this.createTeacher(
    //   body.fullname,
    //   body.email,
    //   body.password,
    // );

    const hash = await this.hashData(body.password);

    const newUser = await this.db.teacher.create({
      data: {
        fullname: body.fullname,
        email: body.email,
        password: hash,
      },
    });

    const tokens = await this.singTokens(
      newUser.id,
      newUser.email,
      newUser.role,
    );
    await this.updateRT(newUser.id, tokens.refresh_token);
    return {
      ac: tokens.access_token,
      rt: tokens.refresh_token,
      user: newUser,
    };
  }

  async signin(body: SigninDto) {
    const user = await this.db.teacher.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return new BadRequestException('Email not exist');
    }

    const isPwMatch = await bcrypt.compare(body.password, user.password);

    if (!isPwMatch) {
      return new BadRequestException('Incorrect Password');
    }

    const tokens = await this.singTokens(user.id, user.email, user.role);
    await this.updateRT(user.id, tokens.refresh_token);
    return {
      ac: tokens.access_token,
      rt: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: string) {
    await this.db.teacher.updateMany({
      where: {
        id: userId,
        rt: {
          not: null,
        },
      },
      data: {
        rt: null,
      },
    });
  }

  async refreshToken(userId: string, rt: string) {
    const user = await this.db.teacher.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.rt) {
      throw new ForbiddenException('Access Denied');
    }

    const isRtMatch = await bcrypt.compare(rt, user.rt);
    if (!isRtMatch) throw new ForbiddenException('Access Denied');

    const tokens = await this.singTokens(user.id, user.email, user.role);
    await this.updateRT(user.id, tokens.refresh_token);
    return {
      at: tokens.access_token,
      rt: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  //* helper functions to hash the data
  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  //* sign token
  private async singTokens(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: jwtConstants.at_secret,
          expiresIn: 60 * 2,
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: jwtConstants.rt_secret,
          expiresIn: 60 * 15 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  //* helper function to update the rt of the user
  private async updateRT(userId: string, rt: string) {
    // hash the rt
    const hashRt = await this.hashData(rt);

    await this.db.teacher.update({
      where: { id: userId },
      data: {
        rt: hashRt,
      },
    });
  }
}
