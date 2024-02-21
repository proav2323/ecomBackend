import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { prismaClient } from './Prisma';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getPrismaTypes() {
    return prismaClient;
  }
}
