import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { product } from '@prisma/client';

@Injectable()
export class ProductServiceController {
  constructor(private prsima: PrismaService) {}
  async getAllProducts(): Promise<product[]> {
    const products = await this.prsima.product.findMany();
    return products.length >= 1 ? products : [];
  }

  async getFeaturedProducts(): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      where: {
        onBanner: true,
      },
    });
    return products.length >= 1 ? products : [];
  }

  async getNewProducts(): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      where: {
        new: true,
      },
    });
    return products.length >= 1 ? products : [];
  }

  async getQueryProducts(query: any): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      where: query,
    });
    return products.length >= 1 ? products : [];
  }

  async getSearchedProducts(query: string): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      where: {
        OR: [
          {
            name: { contains: query, mode: 'insensitive' },
          },
          {
            bannerText: { contains: query, mode: 'insensitive' },
          },
          {
            company: { contains: query, mode: 'insensitive' },
          },
          {
            cta: { contains: query, mode: 'insensitive' },
          },
        ],
      },
    });
    return products.length >= 1 ? products : [];
  }

  async addProduct(data: any): Promise<product> {
    if (!data) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }
    const {
      name,
      description,
      price,
      images,
      colors,
      company,
      onBanner,
      bannerText,
      cta,
      isNew,
      categoryId,
    } = data;

    if (
      !name ||
      !description ||
      !price ||
      images.length <= 0 ||
      colors.length <= 0 ||
      !company ||
      onBanner === undefined ||
      onBanner === null ||
      isNew === undefined ||
      isNew === null ||
      !categoryId
    ) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    if (onBanner === true && (!bannerText || !cta)) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const product = await this.prsima.product.create({
      data: {
        new: isNew,
        name: name,
        description: description,
        price: price,
        images: images,
        colors: {
          connect: colors.map((id: string) => ({ id: id })),
        },
        cta: onBanner ? cta : undefined,
        onBanner: onBanner,
        bannerText: onBanner ? bannerText : undefined,
        company: company,
        categoryId: categoryId,
      },
    });

    return product;
  }

  async updateProduct(data: any, id: string): Promise<product> {
    if (!data) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }
    const {
      name,
      description,
      price,
      images,
      colors,
      company,
      onBanner,
      bannerText,
      cta,
      isNew,
      categoryId,
    } = data;

    if (
      !name ||
      !description ||
      !price ||
      images.length <= 0 ||
      colors.length <= 0 ||
      !company ||
      onBanner === undefined ||
      onBanner === null ||
      isNew === undefined ||
      isNew === null ||
      !categoryId
    ) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    if (onBanner === true && (!bannerText || !cta)) {
      throw new HttpException('invalid data', HttpStatus.BAD_REQUEST);
    }

    const product = await this.prsima.product.update({
      where: {
        id: id,
      },
      data: {
        new: isNew,
        name: name,
        description: description,
        price: price,
        images: images,
        colors: colors,
        cta: onBanner ? cta : undefined,
        onBanner: onBanner,
        bannerText: onBanner ? bannerText : undefined,
        company: company,
        categoryId: categoryId,
      },
    });

    return product;
  }

  async deleteProduct(id: string): Promise<product> {
    const product = await this.prsima.product.delete({
      where: {
        id: id,
      },
    });

    return product;
  }
}
