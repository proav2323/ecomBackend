import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prsima: PrismaService) {}
  async getAllCategory(): Promise<category[]> {
    const products = await this.prsima.category.findMany();
    return products.length >= 1 ? products : [];
  }

  async addCategory(data: any): Promise<category> {
    if (!data) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }
    const { name, image } = data;

    if (!name || !image) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const colorR = await this.prsima.category.create({
      data: {
        name: name,
        image: image,
      },
    });

    return colorR;
  }

  async updateCategory(data: any, id: string): Promise<category> {
    if (!data) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }
    const { name, image } = data;

    if (!name || !image) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const colorR = await this.prsima.category.update({
      where: {
        id: id,
      },
      data: {
        image: image,
        name: name,
      },
    });

    return colorR;
  }

  async deleteCategory(id: string): Promise<category> {
    const color = await this.prsima.category.delete({
      where: {
        id: id,
      },
    });

    return color;
  }
}
