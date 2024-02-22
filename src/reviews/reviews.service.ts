import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}
  async getOne(id: string) {
    const rev = await this.prisma.reviews.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        product: {
          include: {
            category: true,
            reviews: true,
          },
        },
      },
    });
    return rev;
  }

  async getAll() {
    const rev = await this.prisma.reviews.findMany({
      include: {
        user: true,
        product: {
          include: {
            category: true,
            reviews: true,
          },
        },
      },
    });
    return rev;
  }

  async add(body: any) {
    const { userId, comment, stars, productId } = body;

    if (!userId || !comment || !stars || !productId) {
      throw new HttpException('invalid', HttpStatus.BAD_REQUEST);
    }

    const re = await this.prisma.reviews.findMany({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (re.length >= 1) {
      throw new HttpException(
        "can't post two reviews on same product",
        HttpStatus.CONFLICT,
      );
    }

    const rev = await this.prisma.reviews.create({
      data: {
        userId: userId,
        comment: comment,
        stars: stars,
        productId: productId,
      },
    });

    const product = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        reviews: {
          connect: { id: rev.id },
        },
      },
    });
    return rev;
  }

  async update(body: any, id: string) {
    const { comment, stars, userId } = body;

    if (!comment || !stars || !userId) {
      throw new HttpException('invalid', HttpStatus.BAD_REQUEST);
    }

    const rev = await this.prisma.reviews.update({
      data: {
        comment: comment,
        stars: stars,
      },
      where: {
        id: id,
        userId: userId,
      },
    });
    return rev;
  }

  async delete(id: string, userId: string, productId: string) {
    const product = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        reviews: {
          delete: {
            id: id,
            userId: userId,
          },
        },
      },
    });
    return product;
  }
}
