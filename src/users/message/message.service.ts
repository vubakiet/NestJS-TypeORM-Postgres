import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { RoomEntity } from 'src/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private messageRepository: Repository<MessageEntity>,
        @InjectRepository(RoomEntity)
        private roomRepository: Repository<RoomEntity>,
    ) {}

    async getMessagesByRoomId(userId: number, roomId: number) {
        const room = this.roomRepository.findBy({ id: roomId });

        if (!room) {
            throw new HttpException(
                'Room khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        const messagesByRoomId = await this.messageRepository.find({
            where: {
                user: { id: userId },
                room: { id: roomId },
            },
        });

        return messagesByRoomId;
    }
}
