import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotifyDto } from '../dtos/create-notifty.dto';
import { NotificationUserEntity } from 'src/entities/notification-user.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private notificationRepository: Repository<NotificationEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(NotificationUserEntity)
        private notificationUserRepository: Repository<NotificationUserEntity>,
    ) {}

    async createNotify(userId: number, notify: CreateNotifyDto) {
        const { message, userIds } = notify;

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'User khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        const notificationCreating = await this.notificationRepository.create({
            message: message,
        });

        const notificationSaved = await this.notificationRepository.save(
            notificationCreating,
        );

        const defaultUIds = [];

        if (userIds == null) {
            const users = await this.userRepository.find();
            users.map((u) => {
                defaultUIds.push(u.id);
            });

            defaultUIds.map(async (defaultUId) => {
                const defaultNotiUserCreating =
                    await this.notificationUserRepository.create({
                        users: {
                            id: defaultUId,
                        },
                        notifications: {
                            id: notificationSaved.id,
                        },
                    });
                await this.notificationUserRepository.save(
                    defaultNotiUserCreating,
                );
            });
        } else {
            const createDefaultUserSend =
                await this.notificationUserRepository.create({
                    users: { id: userId },
                    notifications: { id: notificationSaved.id },
                });
            await this.notificationUserRepository.save(createDefaultUserSend);

            userIds?.map(async (uId) => {
                const notiUserCreating =
                    await this.notificationUserRepository.create({
                        users: {
                            id: uId,
                        },
                        notifications: {
                            id: notificationSaved.id,
                        },
                    });

                await this.notificationUserRepository.save(notiUserCreating);
            });
        }

        return notify;
    }
}
