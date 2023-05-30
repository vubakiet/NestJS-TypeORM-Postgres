import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { RoomEntity } from "./room.entity";
import { ConnectionStatus } from "src/enum";

@Entity('connections')
export class ConnectionEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    socketId: string
    
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({name: 'userId'})
    user: UserEntity

    @ManyToOne(() => RoomEntity, (room) => room.id)
    room: RoomEntity | null;

    @Column({default: ConnectionStatus.LEAVEDCHAT, nullable: true})
    status: ConnectionStatus
    
}