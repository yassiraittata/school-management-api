import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    console.log('user from guard', user);

    if (user.role === 'admin') {
      return true;
    } else {
      return false;
    }
  }
}
