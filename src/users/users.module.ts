import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProductEntity } from '../entities/product.entity';
import { OrderEntity } from '../entities/order.entity';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { PostModule } from './post/post.module';
import { ReactionModule } from './reaction/reaction.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProductEntity, OrderEntity]),
        ProductModule,
        OrderModule,
        NotificationModule,
        PostModule,
        ReactionModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UserModule {}
