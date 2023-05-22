import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
    ) {}

    async createOrder(userId: number, productIds: any) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'User khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        const orders = [];

        await Promise.all(
            productIds?.productIds.map(async (productId) => {
                const product = await this.productRepository.findOneBy({
                    id: productId,
                });

                if (!product) {
                    return;
                }

                const orderCreated = await this.orderRepository.create({
                    users: { id: userId },
                    products: { id: productId },
                });

                const orderSaved = await this.orderRepository.save(
                    orderCreated,
                );
                orders.push(orderSaved);
                // console.log(orders);
            }),
        );
        console.log(orders);

        return orders;
    }

    async getOrders() {
        return this.orderRepository.find();
    }

    async getOrdersByUser(userId: number) {
        const user = this.orderRepository.find({
            where: {
                users: { id: userId },
            },
            relations: {
                products: true,
                users: true,
            },
        });

        if (!user) {
            throw new HttpException(
                'Khong ton tai User',
                HttpStatus.BAD_REQUEST,
            );
        }

        return user;
    }

    async getOrderById(orderId: number) {
        const order = this.orderRepository.findOne({
            where: {
                id: orderId,
            },
            relations: {
                products: true,
                users: true,
            },
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
