import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { RoomEntity } from 'src/entities/room.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomStatus } from 'src/enum/room-status.enum';
import { JoinRoomDto } from './dtos/join-room.dto';
import { SendMessageDto } from './dtos/send-message.dto';

@Injectable()
export class ChatGatewayService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(RoomEntity)
        private roomRepository: Repository<RoomEntity>,
        @InjectRepository(MessageEntity)
        private messageRepository: Repository<MessageEntity>,
    ) {}

    async handleCreateRoom(token:string, createRoom: CreateRoomDto) {
        const { room_name } = createRoom;

        const user = await this.userRepository.findOneBy({
            access_token: token,
        });
        if (!user) {
            return RoomStatus.NOTEXISTSUSER;
        }

        const room = await this.roomRepository.findOneBy({ name: room_name });

        if (room) {
            return RoomStatus.EXISTSROOM;
        }

        const roomCreated = await this.roomRepository.create({
            name: room_name,
        });

        await this.roomRepository.save(roomCreated);

        return RoomStatus.ROOMCREATED;
    }

    async handleJoinRoom(token: string, joinRoom: JoinRoomDto) {
        const { room_name } = joinRoom;

        const room = await this.roomRepository.findOneBy({
            name: room_name,
        });
        if (!room) {
            return RoomStatus.NOTEXISTSROOM;
        }

        const user = await this.userRepository.findOneBy({
            access_token: token,
        });
        if (!user) {
            return RoomStatus.NOTEXISTSUSER;
        }

        const messageCreating = this.messageRepository.create({
            content: 'Welcome to CHAT',
            user: { id: user.id },
            room: { id: room.id },
        });

        await this.messageRepository.save(messageCreating);

        return RoomStatus.STARTCHAT;
    }

    async handleSendMessage(token: string, sendMessage: SendMessageDto) {
        const { content, room_name } = sendMessage;

        console.log(content);
        

        const user = await this.userRepository.findOneBy({
            access_token: token,
        });
        if (!user) {
            return RoomStatus.NOTEXISTSUSER;
        }

        const room = await this.roomRepository.findOneBy({
            name: room_name,
        });
        if (!room) {
            return RoomStatus.NOTEXISTSROOM;
        }

        const messageCreating = this.messageRepository.create({
            content: content,
            user: { id: user.id },
            room: { id: room.id },
        });

        await this.messageRepository.save(messageCreating);

        return RoomStatus.STARTCHAT;
    }
}
