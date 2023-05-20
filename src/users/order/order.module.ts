import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity])],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
