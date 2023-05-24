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
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('getProductById/:id')
    async getProductById(@Param() productId: number) {
        return await this.productService.getProductById(productId['id']);
    }

    @Get('getProducts')
    async getProductsByUser(@getUser() userId: number) {
        return await this.productService.getProductsByUser(userId);
    }

    @Get('getAvailableProduct')
    async getAvailableProduct() {
        return await this.productService.getAvailableProduct();
    }

    @Get('getDeletedProduct')
    async getDeletedProduct() {
        return await this.productService.getDeletedProduct();
    }

    @Roles(Role.ADMIN)
    @Post('createProduct')
    async createProductByUser(
        @getUser() userId: number,
        @Body() product: CreateProductDto,
    ) {
        return await this.productService.createProductByUser(userId, product);
    }

    @Post('updateProduct/:productId')
    async updateProductByUser(
        @getUser() userId: number,
        @Param() productId: number,
        @Body() product: UpdateProductDto,
    ) {
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
