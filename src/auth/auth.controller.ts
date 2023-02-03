import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';

import { RtGuard } from './guards';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from './decorators';
import { CreateUserDto, SigninDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('signout')
  signout(@CurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refreshToken(@CurrentUser() user: any) {
    const userId = user['sub'];
    const rt = user['refreshToken'];

    return this.authService.refreshToken(userId, rt);
  }
}
