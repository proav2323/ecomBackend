import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { ROLE, User } from '@prisma/client';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
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

  async getUserAll(email: string): Promise<User[]> {
    const user = await this.prisma.user.findMany({
      where: {
        email: {
          not: email,
        },
      },
    });
    return user.length >= 1 ? user : undefined;
  }
  async upadateAdmin(body: any, id: string): Promise<User> {
    const { role } = body;

    if (!role) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.prisma.user.update({
      data: {
        role: role,
      },
      where: {
        id: id,
      },
    });

    return user;
  }

  async delete(id: string) {
    const product = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return product;
  }

  async upadate(body: any, id: string): Promise<User> {
    const { role, name } = body;

    if (!role || !name) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.prisma.user.update({
      data: {
        role: role,
        name: name,
      },
      where: {
        id: id,
      },
    });

    return user;
  }
  async signUp(body: any): Promise<{ token: string }> {
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const userF = await this.getUserWithEmail(email);

    if (userF) {
      throw new HttpException('user found with email', HttpStatus.FOUND);
    }

    const hashPassword: string = bcrypt.hashSync(password, 12);

    const user: User = await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashPassword,
        role: role,
      },
    });

    return {
      token: jsonwebtoken.sign(
        { email: email, id: user.id },
        this.configService.get('SECRET'),
      ),
    };
  }

  async login(body: any): Promise<{ token: string }> {
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

    return {
      token: jsonwebtoken.sign(
        { email: email, id: user.id },
        this.configService.get('SECRET'),
      ),
    };
  }
  async decodeToken(token: string) {
    const value = jsonwebtoken.decode(token);

    return value;
  }
}
