import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('rooms')
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;

    @OneToMany(() => MessageEntity, (message) => message.room)
    messages: MessageEntity[];
}
