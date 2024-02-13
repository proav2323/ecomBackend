import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma-service/prisma-service.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { ProductsController } from './products/products.controller';
import { ProductServiceController } from './product-service/product-service.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, AuthController, ProductsController],
  providers: [AppService, PrismaService, UserService, ProductServiceController],
})
export class AppModule {}
