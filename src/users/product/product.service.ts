import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
    ) {}

    async getProductById(productId: number) {
        const product = this.productRepository.findOneBy({ id: productId });

        if (!product) {
            throw new HttpException(
                'Product ko ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        return product;
    }

    async getAvailableProduct() {
        return await this.productRepository.find({
            where: {
                status: 1,
            },
        });
    }

    async getDeletedProduct() {
        return await this.productRepository.find({
            where: {
                status: 0,
            },
        });
    }

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

        const inputNameSplit = product.name
            .toLowerCase()
            .trim()
            .replace(/\s/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const productExists = await this.productRepository.findOne({
            where: {
                name: product.name,
                nameSplit: inputNameSplit,
            },
        });

        if (productExists) {
            throw new HttpException(
                'Product da ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        const productCreated = await this.productRepository.create({
            name: product.name,
            nameSplit: inputNameSplit,
            price: product.price,
            description: product.description,
            status: 1,
            insertedByUser: { id: userId },
        });

        const productSaved = await this.productRepository.save(productCreated);

        return productSaved;
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

        const productFound = await this.productRepository.findOne({
            where: {
                id: productId,
            },
        });

        if (!productFound) {
            throw new HttpException(
                'Khong tim thay san pham',
                HttpStatus.BAD_REQUEST,
            );
        }

        console.log(product);

        const inputNameSplit = product.name
            .toLowerCase()
            .trim()
            .replace(/\s/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const productNameExists = await this.productRepository.findOne({
            where: {
                nameSplit: inputNameSplit,
            },
        });

        console.log(productFound);

        if (productFound.nameSplit == inputNameSplit) {
            await this.productRepository.update(
                { id: productId },
                {
                    name: product.name,
                    nameSplit: inputNameSplit,
                    price: product.price,
                    description: product.description,
                },
            );
        } else {
            if (productNameExists) {
                throw new HttpException(
                    `Product voi name ${product.name} da ton tai`,
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                await this.productRepository.update(
                    { id: productId },
                    {
                        name: product.name,
                        nameSplit: inputNameSplit,
                        price: product.price,
                        description: product.description,
                    },
                );
            }
        }

        return product;
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

        if (productFound.status == 0) {
            return 'San pham da xoa';
        }

        const productDeleted = await this.productRepository.update(
            { id: productId },
            { status: 0 },
        );
        if (productDeleted) {
            return 'Xoa thanh cong';
        }
    }
}
