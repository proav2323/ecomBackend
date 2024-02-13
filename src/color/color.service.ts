import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { Color } from '@prisma/client';

@Injectable()
export class ColorService {
  constructor(private prsima: PrismaService) {}
  async getAllColors(): Promise<Color[]> {
    const products = await this.prsima.color.findMany();
    return products.length >= 1 ? products : [];
  }

  async addColor(data: any): Promise<Color> {
    if (!data) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }
    const { name, color } = data;

    if (!name || !color) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const colorR = await this.prsima.color.create({
      data: {
        name: name,
        color: color,
      },
    });

    return colorR;
  }

  async updateProduct(data: any, id: string): Promise<Color> {
    if (!data) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }
    const { name, color } = data;

    if (!name || !color) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const colorR = await this.prsima.color.update({
      where: {
        id: id,
      },
      data: {
        color: color,
        name: name,
      },
    });

    return colorR;
  }

  async deleteProduct(id: string): Promise<Color> {
    const color = await this.prsima.color.delete({
      where: {
        id: id,
      },
    });

    return color;
  }
}
