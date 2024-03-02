import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getUserOrders(userId: string) {
    return await this.prismaService.order.findMany({
      where: {
        orderById: userId,
      },
            include: {
        orderBy: true,
      }
    });
  }

  async getOrders() {
    return await this.prismaService.order.findMany({
      include: {
        orderBy: true,
      }
    });
  }
  async getOrdderWithId(id: string) {
    return await this.prismaService.order.findUnique({
      where: {
        id: id,
      },
    });
  }
  async addOrder(data: any, req: Request) {
    const {
      totalPrice,
      totalQty,
      cart,
      method,
      cardNumber,
      cvv,
      nameOfCard,
      expiry,
      status,
      address,
      userId,
    } = data;

    if (
      !totalPrice ||
      !totalQty ||
      !cart ||
      !method ||
      !cardNumber ||
      !cvv ||
      !nameOfCard ||
      !expiry ||
      !status ||
      !address ||
      !userId
    ) {
      throw new HttpException('invalid data', HttpStatus.BAD_GATEWAY);
    }
    const order = await this.prismaService.order.create({
      data: {
        orderById: userId,
        cvv: cvv,
        cart: cart,
        method,
        cardNumber,
        expiry,
        nameOfCard,
        totalQty,
        totalPrice,
        status,
        address: address,
      },
    });
    return order;
  }

  async updateOrder(data: any, id: string) {
    const { status } = data;

    if (!status) {
      throw new HttpException('invalid data', HttpStatus.BAD_GATEWAY);
    }
    const order = await this.prismaService.order.update({
      data: {
        status: status,
      },
      where: {
        id: id,
      },
    });
    return order;
  }

  async deleteOrder(id: string) {
    const order = await this.prismaService.order.delete({
      where: {
        id: id,
      },
    });
    return order;
  }
}
