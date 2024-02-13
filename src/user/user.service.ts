import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { ROLE, User } from '@prisma/client';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  async getUserWithId(id: any): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user ? user : undefined;
  }

  async getUserWithEmail(email: any): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user ? user : undefined;
  }
  async signUp(body: any): Promise<string> {
    const { email, password, name } = body;

    if (!email || !password || !name) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const hashPassword: string = bcrypt.hashSync(password, 12);

    const user: User = await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashPassword,
        role: email === 'anshvishesh03@gmail.com' ? ROLE.ADMIN : ROLE.USER,
      },
    });

    return jsonwebtoken.sign(
      { email: email, id: user.id },
      this.configService.get('SECRET'),
    );
  }

  async login(body: any): Promise<string> {
    const { email, password } = body;

    if (!email || !password) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.getUserWithEmail(email);

    if (!user) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new HttpException('wrong password', HttpStatus.BAD_REQUEST);
    }

    return jsonwebtoken.sign(
      { email: email, id: user.id },
      this.configService.get('SECRET'),
    );
  }
}
