import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entity/product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { OrderEntity } from './entity/order.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private productsRepository: Repository<ProductEntity>,
        @InjectRepository(OrderEntity)
        private ordersRepository: Repository<OrderEntity>,
    ) {}

    async getUsers() {
        return await this.usersRepository.find();
    }


    async getProductsByUserId(userId: number) {
        return await this.productsRepository.findBy({
            user: {
                id: userId,
            },
        });
    }

    async createProductByUserId(userId: number, product: CreateProductDto) {
        const user = await this.usersRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }

        const newProduct = await this.productsRepository.create({
            ...product,
            user: { id: userId },
        });
        console.log(newProduct);

        await this.productsRepository.save(newProduct);

        return user;
    }

    async updateProductByUserId(
        userId: number,
        productId: number,
        product: UpdateProductDto,
    ) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new HttpException(
                'Khong ton tai User',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (user) {
            const productFound = await this.productsRepository.findOne({
                where: {
                    user,
                    id: productId,
                },
            });

            if (!productFound) {
                throw new HttpException(
                    'Khong tim thay san pham',
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this.productsRepository.update(
                { id: productId },
                {
                    ...product,
                },
            );
            return product;
        }
    }

    async deleteProductByUserId(userId: number, productId: number) {
        const user = await this.usersRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'Khong ton tai user',
                HttpStatus.BAD_REQUEST,
            );
        }

        const productFound = await this.productsRepository.findOneBy({
            id: productId,
        });

        if (!productFound) {
            throw new HttpException(
                'Khong ton tai product',
                HttpStatus.BAD_REQUEST,
            );
        }

        const productDeleted = await this.productsRepository.delete({
            id: productId,
        });
        if (productDeleted) {
            return 'Xoa thanh cong';
        }
    }

    async createOrder(userId: number, productIds: Array<number>) {
        const user = await this.usersRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'Khong ton tai user',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.ordersRepository.create({
            
        });
    }
}
