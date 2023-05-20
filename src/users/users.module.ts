import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProductEntity } from '../entities/product.entity';
import { OrderEntity } from '../entities/order.entity';
import { ProductModule } from './product/product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProductEntity, OrderEntity]),
        ProductModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UserModule {}
