import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { product } from '@prisma/client';

@Injectable()
export class ProductServiceController {
  constructor(private prsima: PrismaService) {}
  async getAllProducts(): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      include: {
        colors: true,
        category: true,
      },
    });
    return products.length >= 1 ? products : [];
  }
  async getProductsWithId(id: string): Promise<product> {
    const products = await this.prsima.product.findUnique({
      where: {
        id: id,
      },
      include: {
        colors: true,
        category: true,
      },
    });
    return products;
  }

  async getFeaturedProducts(): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      where: {
        onBanner: true,
      },
      include: {
        colors: true,
        category: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });
    return products.length >= 1 ? products : [];
  }

  async getNewProducts(): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      where: {
        new: true,
      },
      include: {
        colors: true,
        category: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });
    return products.length >= 1 ? products : [];
  }

  async getQueryProducts(query: any): Promise<product[]> {
    const products = await this.prsima.product.findMany({
      where: query,
      include: {
        colors: true,
        category: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
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
            description: { contains: query, mode: 'insensitive' },
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
      include: {
        colors: true,
        category: true,
        reviews: {
          include: {
            user: true,
          },
        },
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
      stock,
    } = data;

    if (
      !name ||
      !description ||
      price === 0 ||
      images.length <= 0 ||
      colors.length <= 0 ||
      !company ||
      onBanner === undefined ||
      onBanner === null ||
      isNew === undefined ||
      isNew === null ||
      !categoryId ||
      stock === 0
    ) {
      throw new HttpException('invalid dataaaa', HttpStatus.BAD_REQUEST);
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
        stock: stock,
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
      stock,
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
      !categoryId ||
      !stock
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
        stock: stock,
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
