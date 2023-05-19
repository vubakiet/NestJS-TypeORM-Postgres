import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('getUsers')
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Post('createProductById/:userId')
  async createProductByUserId(
    @Param() userId: number,
    @Body() product: CreateProductDto,
  ) {
    return this.usersService.createProductByUserId(userId['userId'], product);
  }
}
