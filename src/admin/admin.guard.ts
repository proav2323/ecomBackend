import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as jsonwebtoken from 'jsonwebtoken';
import process from 'process';
import { Request } from 'express';
import { ROLE } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = jsonwebtoken.verify(
        token,
        this.configService.get<string>('SECRET'),
      );
      request['user'] = await this.userService.getUserWithId(payload['id']);
    } catch (Err: any) {
      throw new UnauthorizedException();
    }
    return request['user'].role === ROLE.ADMIN;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
