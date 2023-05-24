import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { UserEntity } from 'src/entities/user.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { CreateNotifyDto } from './dtos/create-notifty.dto';
import {
    IPaginationOptions,
    Pagination,
    paginate,
} from 'nestjs-typeorm-paginate';
import { AllPaginationsDto } from './dtos/all-paginations.dto';
import { PaginationByIdDto } from './dtos/pagination-by-id.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private notificationRepository: Repository<NotificationEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
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

        const defaultUIds = [];
        defaultUIds.push(userId);

        if (userIds?.length > 0) {
            const usersFound = await this.userRepository.find({
                where: {
                    id: In(userIds),
                },
            });

            usersFound.map(async (userFound) => {
                if (userFound.id != userId) {
                    defaultUIds.push(userFound.id);
                }
            });

            const notiUserCreating = this.notificationRepository.create({
                user_ids: defaultUIds,
                message: message,
            });

            const notiUserSave = await this.notificationRepository.save(
                notiUserCreating,
            );
            return notiUserSave;
        } else {
            // const users = await this.userRepository.find();
            // const userids = users.map(async (u) => u.id);

            const notiUserCreating = await this.notificationRepository.create({
                message: message,
            });

            const notiUserSave = await this.notificationRepository.save(
                notiUserCreating,
            );
            return notiUserSave;
        }
    }

    async getNotifications(userId: number) {
        const noticfyList = await this.notificationRepository
            .createQueryBuilder('notifyList')
            .where(`:userId = ANY(notifyList.user_ids)`, { userId: userId })
            .orWhere(`notifyList.user_ids IS NULL`)
            .getMany();

        return noticfyList;

        // const notiUser_ids = [];
        // const arrayNotiUsers = [];

        // notiUsers.forEach(async (notiUser) => {
        //     if (notiUser.user_ids.length > 0) {
        //         notiUser.user_ids.forEach(async (noti_userId) => {
        //             if (noti_userId == userId) {
        //                 await notiUser_ids.push(notiUser.id);
        //             }
        //         });
        //     }
        //     else{

        //     }
        // });

        // console.log(notiUser_ids);

        // await Promise.all(
        //     notiUser_ids.map(async (notiUser_id) => {
        //         const notiUser = await this.notificationRepository.findOne({
        //             where: {
        //                 id: notiUser_id,
        //             },
        //         });

        //         await arrayNotiUsers.push(notiUser);
        //     }),
        // );

        // return arrayNotiUsers;
    }

    async getPaginationNotifications(
        options: IPaginationOptions,
    ): Promise<Pagination<NotificationEntity>> {
        console.log(options);

        return paginate<NotificationEntity>(
            this.notificationRepository,
            options,
        );
    }

    async getNofiticationsPaginate(allPaginationsDto: AllPaginationsDto) {
        const { page, limit } = allPaginationsDto;

        const skip = (page - 1) * limit;

        const noticfyList = await this.notificationRepository.find({
            skip: skip,
            take: limit,
        });

        return noticfyList;
    }

    async getNotificationById(paginationsByIdDto: PaginationByIdDto) {
        const { notifyId, page, limit } = paginationsByIdDto;

        if (notifyId != null) {
            const notiUser = await this.notificationRepository.findOneBy({
                id: notifyId,
            });

            if (!notiUser) {
                throw new HttpException(
                    'Khong ton tai Notification',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const notifyList = await this.notificationRepository.find({
                where: {
                    id: MoreThan(notifyId),
                },
                take: limit,
            });

            return notifyList;
        } else {
            const skip = (page - 1) * limit;
            const notifyList = await this.notificationRepository.find({
                skip: skip,
                take: limit,
            });

            return notifyList;
        }
    }
}
