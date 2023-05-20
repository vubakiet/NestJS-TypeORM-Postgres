import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
    ) {}

    async getProductsByUser(userId: number) {
        return await this.productRepository.findBy({
            insertedByUser: { id: userId },
        });
    }

    async createProductByUser(userId: number, product: CreateProductDto) {
        const user = await this.usersRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }

        const newProduct = await this.productRepository.create({
            ...product,
            insertedByUser: { id: userId },
        });
        console.log(newProduct);

        await this.productRepository.save(newProduct);

        return user;
    }

    async updateProductByUser(
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
            const productFound = await this.productRepository.findOne({
                where: {
                    insertedByUser: user,
                    id: productId,
                },
            });

            if (!productFound) {
                throw new HttpException(
                    'Khong tim thay san pham',
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this.productRepository.update(
                { id: productId },
                {
                    ...product,
                },
            );
            return product;
        }
    }

    async deleteProductByUser(userId: number, productId: number) {
        const user = await this.usersRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'Khong ton tai user',
                HttpStatus.BAD_REQUEST,
            );
        }

        const productFound = await this.productRepository.findOneBy({
            id: productId,
        });

        if (!productFound) {
            throw new HttpException(
                'Khong ton tai product',
                HttpStatus.BAD_REQUEST,
            );
        }

        const productDeleted = await this.productRepository.delete({
            id: productId,
        });
        if (productDeleted) {
            return 'Xoa thanh cong';
        }
    }
}
