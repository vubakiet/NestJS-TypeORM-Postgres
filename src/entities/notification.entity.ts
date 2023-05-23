import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notification')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    message: string;

    @Column({
        type: Number,
        array: true,
        nullable: true,
    })
    user_ids: number[];
}
