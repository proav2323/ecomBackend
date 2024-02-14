import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AdminGuard } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @UseGuards(AdminGuard)
  @Get('/')
  async getAll() {
    return await this.orderService.getOrders();
  }

  @UseGuards(AuthGuard)
  @Get('/user/:id')
  async getUserOrder(@Param('id') id: string) {
    return await this.orderService.getUserOrders(id);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getOrder(@Param('id') id: string) {
    return await this.orderService.getOrdderWithId(id);
  }

  @UseGuards(AuthGuard)
  @Post('/add')
  async addOrder(@Body() body, @Req() req: Request) {
    return await this.orderService.addOrder(body, req);
  }

  @UseGuards(AdminGuard)
  @Put('/update/:id')
  async updateOrder(@Body() body, @Param('id') id: string) {
    return await this.orderService.updateOrder(body, id);
  }

  @UseGuards(AdminGuard)
  @Delete('/delete/:id')
  async deleteOrder(@Param('id') id: string) {
    return await this.orderService.deleteOrder(id);
  }
}
