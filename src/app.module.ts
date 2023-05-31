import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './entities/user.entity';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductEntity } from './entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { OrderEntity } from './entities/order.entity';
import { NotificationEntity } from './entities/notification.entity';
import { PostEntity } from './entities/post.entity';
import { ReactEnity } from './entities/react.entity';
import { CommentEntity } from './entities/comment.entity';
import { GatewayModule } from './gateway/gateway.module';
import { RoomEntity } from './entities/room.entity';
import { MessageEntity } from './entities/message.entity';
import { ConnectionEntity } from './entities/connection.entity';
import { ReactionMessageEntity } from './entities/reaction-message.entity';
import { EmojiEntity } from './entities/emoji.entity';
import { EmojiModule } from './emoji/emoji.module';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [
                UserEntity,
                ProductEntity,
                OrderEntity,
                NotificationEntity,
                PostEntity,
                ReactEnity,
                CommentEntity,
                RoomEntity,
                MessageEntity,
                ConnectionEntity,
                ReactionMessageEntity,
                EmojiEntity
            ],
            synchronize: true,
        }),
        AuthModule,
        GatewayModule,
        EmojiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
