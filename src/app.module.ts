import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma-service/prisma-service.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { ProductsController } from './products/products.controller';
import { ProductServiceController } from './product-service/product-service.controller';
import { ConfigModule } from '@nestjs/config';
import { ColorController } from './color/color.controller';
import { ColorService } from './color/color.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [
    AppController,
    AuthController,
    ProductsController,
    ColorController,
    CategoryController,
    OrderController,
  ],
  providers: [
    AppService,
    PrismaService,
    UserService,
    ProductServiceController,
    ColorService,
    CategoryService,
    OrderService,
  ],
})
export class AppModule {}
