import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private revService: ReviewsService) {}

  @Get('/')
  async getAll() {
    return await this.revService.getAll();
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    return await this.revService.getOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('/add')
  async add(@Body() data) {
    return await this.revService.add(data);
  }

  @UseGuards(AuthGuard)
  @Put('/update/:id')
  async update(@Body() data, @Param('id') id: string) {
    return await this.revService.update(data, id);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id/:userId/:productId')
  async delete(@Param('id') id: string, @Param('userId') userId: string, @Param('productId') productId: string) {
    return await this.revService.delete(id, userId, productId);
  }
}
