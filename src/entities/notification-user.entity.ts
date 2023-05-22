import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { NotificationEntity } from './notification.entity';

@Entity('notification-user')
export class NotificationUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    users: UserEntity;

    @ManyToOne(() => NotificationEntity, (notification) => notification.id)
    @JoinColumn({ name: 'notification_id' })
    notifications: NotificationEntity;
}
