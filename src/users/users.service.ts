import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectRepository(OrderEntity)
        private ordersRepository: Repository<OrderEntity>,
    ) {}

    async getUsers() {
        return await this.usersRepository.find();
    }

    // async createOrder(userId: number, productIds: Array<number>) {
    //     const user = await this.usersRepository.findOneBy({ id: userId });

    //     if (!user) {
    //         throw new HttpException(
    //             'Khong ton tai user',
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }

    //     const orderCreated = this.ordersRepository.create({
    //         user: { id: userId },
    //     });

    //     const orderSaved = await this.ordersRepository.save(orderCreated);

    //     if (orderSaved) {
    //         productIds.forEach(async (productId) => {
    //             const product = await this.productsRepository.findOneBy({
    //                 id: productId,
    //             });

    //             if (!product) {
    //                 throw new HttpException(
    //                     'Khong ton tai product',
    //                     HttpStatus.BAD_REQUEST,
    //                 );
    //             }

    //             const productCreated = await this.productsRepository.create({
    //                 id: productId,
    //                 order: { id: orderSaved.id },
    //             });

    //             await this.productsRepository.save(productCreated);
    //         });
    //     }

    //     return orderCreated;
    // }
}
