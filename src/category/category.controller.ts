import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  async getAll() {
    return await this.categoryService.getAllCategory();
  }
  @UseGuards(AdminGuard)
  @Post('/add')
  async addColor(@Body() data) {
    return await this.categoryService.addCategory(data);
  }

  @UseGuards(AdminGuard)
  @Put('/update/:id')
  async updateColor(@Body() data, @Param('id') id: string) {
    return await this.categoryService.updateCategory(data, id);
  }

  @UseGuards(AdminGuard)
  @Delete('/delete/:id')
  async DeleteColor(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
