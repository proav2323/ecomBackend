import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { AdminGuard } from '../admin/admin.guard';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}
  @Get('/:id')
  async getUserWithId(@Param('id') id): Promise<User> {
    return await this.userService.getUserWithId(id);
  }

  @UseGuards(AdminGuard)
  @Get('/admin/:email')
  getAll(@Param('email') email: string) {
    return this.userService.getUserAll(email);
  }

  @Get('/email/:email')
  async getUserWithEmail(@Param('email') email): Promise<User> {
    return await this.userService.getUserWithEmail(email);
  }

  @Post('/signUp')
  async signUp(@Body() data) {
    return this.userService.signUp(data);
  }

  @Post('/login')
  async login(@Body() data) {
    return this.userService.login(data);
  }

  @Get('/decode/:token')
  decodeToekn(@Param('token') token: string) {
    return this.userService.decodeToken(token);
  }

  @UseGuards(AdminGuard)
  @Put('/admin/update/:id')
  updateA(@Body() data, @Param('id') id: string) {
    return this.userService.upadateAdmin(data, id);
  }

  @UseGuards(AuthGuard)
  @Put('/update/:id')
  update(@Body() data, @Param('id') id: string) {
    return this.userService.upadate(data, id);
  }
}
