import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationUserEntity } from './notification-user.entity';

@Entity('notification')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    message: string;

    @OneToMany(
        () => NotificationUserEntity,
        (notiUser) => notiUser.notifications,
    )
    notificationTo: NotificationUserEntity[];
}
