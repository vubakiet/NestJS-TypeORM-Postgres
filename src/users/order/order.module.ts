import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ProductEntity } from 'src/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, UserEntity, ProductEntity]),
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
