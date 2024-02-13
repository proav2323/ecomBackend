import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductServiceController } from '../product-service/product-service.controller';
import { AdminGuard } from '../admin/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductServiceController) {}
  @Get()
  async getAll() {
    return await this.productService.getAllProducts();
  }

  @Get('/featured')
  async getFeatured() {
    return await this.productService.getFeaturedProducts();
  }

  @Get('/new')
  async getNew() {
    return await this.productService.getNewProducts();
  }

  @Get('/search')
  async getSearch(@Query('search') search: string) {
    return await this.productService.getSearchedProducts(search);
  }

  @Get('/query')
  async getQuery(
    @Query('price') price: number,
    @Query('company') company: string,
    @Query('color') colorId: string,
  ) {
    let query = {};

    if (price) {
      query = { ...query, price: price };
    }
    if (company) {
      query = { ...query, company: company };
    }
    if (colorId) {
      query = {
        ...query,
        colors: {
          some: {
            id: colorId,
          },
        },
      };
    }
    return await this.productService.getQueryProducts(query);
  }

  @UseGuards(AdminGuard)
  @Post('/add')
  async addProduct(@Body() data) {
    return await this.productService.addProduct(data);
  }

  @UseGuards(AdminGuard)
  @Delete('/delete/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @UseGuards(AdminGuard)
  @Put('/update/:id')
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return await this.productService.updateProduct(data, id);
  }
}
