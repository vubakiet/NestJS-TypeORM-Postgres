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
import { LeaveRoomDto } from './dtos/leave-room.dto';
import { ConnectionEntity } from 'src/entities/connection.entity';
import { ConnectionStatus } from 'src/enum';
import { EmojiEntity } from 'src/entities/emoji.entity';
import { ReactionMessageEntity } from 'src/entities/reaction-message.entity';
import { ReactionMessageDto } from './dtos/reaction-message.dto';

@Injectable()
export class ChatGatewayService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(RoomEntity)
        private roomRepository: Repository<RoomEntity>,
        @InjectRepository(MessageEntity)
        private messageRepository: Repository<MessageEntity>,
        @InjectRepository(ConnectionEntity)
        private connectionRepository: Repository<ConnectionEntity>,
        @InjectRepository(EmojiEntity)
        private emojiRepository: Repository<EmojiEntity>,
        @InjectRepository(ReactionMessageEntity)
        private reactionMessageRepository: Repository<ReactionMessageEntity>,
    ) {}

    async handleConnection(socketId: string, token: string) {
        const user = await this.userRepository.findOneBy({
            access_token: token,
        });

        if (!user) {
            return RoomStatus.NOTEXISTSUSER;
        }

        const userConnection = await this.connectionRepository.findOne({
            where: {
                user: { id: user.id },
                status: ConnectionStatus.JOINEDCHAT,
            },
            relations: { room: true },
        });

        const userConnectionCreated = this.connectionRepository.create({
            socketId,
            status: userConnection
                ? ConnectionStatus.JOINEDCHAT
                : ConnectionStatus.LEAVEDCHAT,
            user: { id: user.id },
            room: { id: userConnection?.room?.id || null },
        });
        await this.connectionRepository.save(userConnectionCreated);

        return RoomStatus.STARTCONNECTION;
    }

    async handleDisconnect(socketId: string) {
        await this.connectionRepository.delete({ socketId });
        return ConnectionStatus.DISCONNECT;
    }

    async handleCreateRoom(token: string, createRoom: CreateRoomDto) {
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

        await this.connectionRepository.update(
            { user: { id: user.id } },
            { status: ConnectionStatus.JOINEDCHAT, room: { id: room.id } },
        );

        return RoomStatus.STARTCHAT;
    }

    async handleLeaveRoom(token: string, leaveRoom: LeaveRoomDto) {
        const { room_name } = leaveRoom;

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

        const userMessage = await this.messageRepository.find({
            where: {
                user: { id: user.id },
                room: { id: room.id },
            },
        });

        if (userMessage) {
            return RoomStatus.USERROOMEXISTED;
        }
    }

    async handleJoinChat(token: string, joinChat: JoinRoomDto) {
        const { room_name } = joinChat;

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

        await this.connectionRepository.update(
            { user: { id: user.id } },
            { status: ConnectionStatus.JOINEDCHAT },
        );

        return ConnectionStatus.JOINEDCHAT;
    }

    async handleLeaveChat(token: string, leaveChat: LeaveRoomDto) {
        const { room_name } = leaveChat;

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

        await this.connectionRepository.update(
            { user: { id: user.id } },
            { status: ConnectionStatus.LEAVEDCHAT, room: { id: null } },
        );

        return ConnectionStatus.LEAVEDCHAT;
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

        const userRoom = await this.messageRepository.findOne({
            where: {
                user: { id: user.id },
                room: { id: room.id },
            },
        });
        const userJoinedChat = await this.connectionRepository.findOneBy({
            user: { id: user.id },
            status: ConnectionStatus.JOINEDCHAT,
        });

        const userLeavedChat = await this.connectionRepository.find({
            where: {
                status: ConnectionStatus.LEAVEDCHAT,
            },
        });

        console.log(userLeavedChat);

        if (userRoom) {
            const messageCreating = this.messageRepository.create({
                content: content,
                user: { id: user.id },
                room: { id: room.id },
            });
            console.log(messageCreating);

            await this.messageRepository.save(messageCreating);

            //     return RoomStatus.STARTCHAT;
            // } else {
            //     return RoomStatus.STARTFAILED;
            // }
            // if (userJoinedChat) {
            //     return RoomStatus.STARTJOINCHAT;
            // }

            if (userLeavedChat.length != 0) {
                const listUserLeaveChat = userLeavedChat.map(
                    (user) => user.socketId,
                );

                return listUserLeaveChat;
            }
        }
    }

    async handleReactionMessage(
        token: string,
        reactionMessage: ReactionMessageDto,
    ) {
        const { messageId, emojiId, room_name } = reactionMessage;

        const user = await this.userRepository.findOne({
            where: {
                access_token: token,
            },
        });

        if (!user) {
            return 'Khong ton tai user';
        }

        const room = await this.roomRepository.findOneBy({ name: room_name });
        if (!room) {
            return 'Khong ton tai room';
        }

        const message = await this.messageRepository.findOne({
            where: { id: messageId, room: { id: room.id } },
            relations: { reactionMessage: true },
        });

        if (!message) {
            return 'Khong ton tai message';
        }

        const emoji = await this.emojiRepository.findOneBy({ id: emojiId });

        if (!emoji) {
            return 'Khong ton tai emoji';
        }

        const messageEmoji = await this.reactionMessageRepository.findOne({
            where: {
                message: { id: messageId },
                user: { id: user.id },
                emoji: { id: emojiId },
            },
        });

        if (messageEmoji) {
            await this.reactionMessageRepository.update(
                {
                    message: { id: messageId },
                    user: { id: user.id },
                    emoji: { id: emojiId },
                },
                { quantity: messageEmoji.quantity + 1 },
            );

            return 'Da cap nhat';
        }

        const reactMessageCreating = this.reactionMessageRepository.create({
            message: { id: messageId },
            user: { id: user.id },
            emoji: { id: emojiId },
        });

        const reactMessageSaved = await this.reactionMessageRepository.save(
            reactMessageCreating,
        );

        return reactMessageSaved;
    }
}
