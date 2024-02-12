import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}
  @Get('/:id')
  async getUserWithId(@Param('id') id): Promise<User> {
    return this.userService.getUserWithId(id);
  }

  @Get('/email/:email')
  async getUserWithEmail(@Param('email') email): Promise<User> {
    return this.userService.getUserWithEmail(email);
  }

  @Post('/signUp')
  async signUp(@Body() data) {
    return this.userService.signUp(data);
  }

  @Post('/login')
  async login(@Body() data) {
    return this.userService.login(data);
  }
}
