import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { getUser } from '../decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('getProducts')
    async getProductsByUser(@getUser() user: any) {
        const userId = user.userId;
        return await this.productService.getProductsByUser(userId);
    }

    @Post('createProduct')
    async createProductByUser(
        @getUser() user: any,
        @Body() product: CreateProductDto,
    ) {
        const userId = user.userId;
        return await this.productService.createProductByUser(userId, product);
    }

    @Post('updateProduct/:productId')
    async updateProductByUser(
        @getUser() user: any,
        @Param() productId: number,
        @Body() product: UpdateProductDto,
    ) {
        const userId = user.userId;

        return await this.productService.updateProductByUser(
            userId,
            productId['productId'],
            product,
        );
    }

    @Post('deleteProduct/:pId')
    async deleteProductByUser(
        @getUser() user: any,
        @Param() productId: number,
    ) {
        const userId = user.userId;
        return await this.productService.deleteProductByUser(
            userId,
            productId['pId'],
        );
    }

}
