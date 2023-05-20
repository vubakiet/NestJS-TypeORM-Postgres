import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
    ) {}

    async createOrder(userId: number, productIds: Array<number>) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'User khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        productIds.forEach(async (productId) => {
            const orderCreated = await this.orderRepository.create({
                users: { id: userId },
                products: { id: productId },
            });

            const orderSaved = await this.orderRepository.save(orderCreated);
            return orderSaved;
        });
    }

    async getOrders() {
        return this.orderRepository.find();
    }

    async getOrderById(orderId: number) {
        const order = this.orderRepository.findOne({
            where: {
                id: orderId,
            },
            relations:[
                'users','users.userBought'
            ]
        });

        if (!order) {
            throw new HttpException(
                'Khong tim thay Order',
                HttpStatus.BAD_REQUEST,
            );
        }

        return order;
    }
}
