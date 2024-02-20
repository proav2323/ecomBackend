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
import { ColorService } from './color.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('color')
export class ColorController {
  constructor(private colorService: ColorService) {}

  @Get('/')
  async getAll() {
    return await this.colorService.getAllColors();
  }

  @Get('/:id')
  async getone(@Param('id') id: string) {
    return await this.colorService.getOne(id);
  }
  @UseGuards(AdminGuard)
  @Post('/add')
  async addColor(@Body() data) {
    return await this.colorService.addColor(data);
  }

  @UseGuards(AdminGuard)
  @Put('/update/:id')
  async updateColor(@Body() data, @Param('id') id: string) {
    return await this.colorService.updateProduct(data, id);
  }

  @UseGuards(AdminGuard)
  @Delete('/delete/:id')
  async DeleteColor(@Param('id') id: string) {
    return await this.colorService.deleteProduct(id);
  }
}
