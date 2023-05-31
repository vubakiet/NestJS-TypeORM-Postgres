import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';
import { ReactionMessageEntity } from './reaction-message.entity';

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

    @OneToMany(
        () => ReactionMessageEntity,
        (reactMessage) => reactMessage.message,
    )
    reactionMessage: ReactionMessageEntity;
}
