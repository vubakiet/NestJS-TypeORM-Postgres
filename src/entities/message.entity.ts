import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @ManyToOne(() => RoomEntity, (room) => room.id)
    room: RoomEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;
}
