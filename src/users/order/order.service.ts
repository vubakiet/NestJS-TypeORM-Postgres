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
        private orderService: Repository<OrderEntity>,
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
            const orderCreated = await this.orderService.create({
                users: { id: userId },
                products: { id: productId },
            });

            const orderSaved = await this.orderService.save(orderCreated);
            return orderSaved;
        });
    }
}
