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
            ],
            synchronize: true,
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
