import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}
