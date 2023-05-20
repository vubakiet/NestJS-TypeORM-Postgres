import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('getUsers')
    async getUsers(@Req() req: Request) {
        console.log({
            user: req.headers,
        });

        return await this.usersService.getUsers();
    }

    

    @Get('getProductsByUserId/:userId')
    async getProductsByUserId(@Param() userId: number) {
        return await this.usersService.getProductsByUserId(userId['userId']);
    }

    @Post('createProductByUserId/:userId')
    async createProductByUserId(
        @Param() userId: number,
        @Body() product: CreateProductDto,
    ) {
        return await this.usersService.createProductByUserId(
            userId['userId'],
            product,
        );
    }

    @Post('updateProductByUserId/:userId/:productId')
    async updateProductByUserId(
        @Param() userId: number,
        @Param() productId: number,
        @Body() product: UpdateProductDto,
    ) {
        return await this.usersService.updateProductByUserId(
            userId['userId'],
            productId['productId'],
            product,
        );
    }

    @Post('deleteProductByUserId/:uId/:pId')
    async deleteProductByUserId(
        @Param() userId: number,
        @Param() productId: number,
    ) {
        return await this.usersService.deleteProductByUserId(
            userId['uId'],
            productId['pId'],
        );
    }
}
