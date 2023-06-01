import { OnModuleInit } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { ChatGatewayService } from './chat-gateway.service';
import { RoomStatus } from 'src/enum/room-status.enum';
import { SendMessageDto } from './dtos/send-message.dto';
import { LeaveRoomDto } from './dtos/leave-room.dto';
import { ConnectionStatus } from 'src/enum';
import { ReactionMessageDto } from './dtos/reaction-message.dto';

interface User {
    id: string;
    name: string;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway
    implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private chatService: ChatGatewayService) {}

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(`Connected to ${socket.id}`);
        });
    }

    connectedUsers: User[] = [];

    async handleConnection(client: Socket, ...args: any[]) {
        const token = client.handshake.headers.authorization;

        const StartConnection = await this.chatService.handleConnection(
            client.id,
            token,
        );

        if (StartConnection === RoomStatus.STARTCONNECTION) {
            const user: User = {
                id: client.id,
                name: `User: ${client.id}`,
            };

            this.connectedUsers.push(user);
            this.server.emit('users', this.connectedUsers);
        } else {
            this.server.emit('ConnectedFailed', {
                message: 'User not connected',
            });
        }
    }

    async handleDisconnect(client: Socket) {
        const userDisconnect = await this.chatService.handleDisconnect(
            client.id,
        );
        if (userDisconnect === ConnectionStatus.DISCONNECT) {
            const index = this.connectedUsers.findIndex(
                (user) => user.id === client.id,
            );
            if (index !== -1) {
                this.connectedUsers.splice(index, 1);
                this.server.emit('users', this.connectedUsers);
            }
        } else {
            this.server.emit('DisconnectFailed', {
                message: 'User not disconnect',
            });
        }
    }

    @SubscribeMessage('createRoom')
    async handleCreateRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() createRoom: CreateRoomDto,
    ) {
        const token = client.handshake.headers.authorization;

        // console.log(createRoom.room_name?.toString());
        const existedRoom = await this.chatService.handleCreateRoom(
            token,
            createRoom,
        );
        if (existedRoom === RoomStatus.ROOMCREATED) {
            client.join(createRoom.room_name?.toString());

            const StartedChat = await this.chatService.handleJoinRoom(
                token,
                createRoom,
            );

            // console.log(StartedChat);

            if (StartedChat === RoomStatus.STARTCHAT) {
                this.server
                    .to(createRoom.room_name?.toString())
                    .emit('joinedRoom', { message: 'success' });
            } else {
                this.server.emit('joinRoomFailed', {
                    message: 'Faild to join Room',
                });
            }
            this.server.emit('createdRoom', { message: 'create successfully' });
        } else {
            this.server.emit('createdRoomError', {
                message: 'failed to create room',
            });
        }
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() joinRoom: JoinRoomDto,
    ) {
        console.log('Joining room:', joinRoom.room_name?.toString());
        // console.log(client);
        const token = client.handshake.headers.authorization;

        if (token) {
            console.log(token);

            client.join(joinRoom.room_name?.toString());
        }

        const StartedChat = await this.chatService.handleJoinRoom(
            token,
            joinRoom,
        );

        console.log(client.rooms);
        // console.log(StartedChat);
        console.log(StartedChat);

        if (StartedChat === RoomStatus.STARTCHAT) {
            this.server
                .to(joinRoom.room_name?.toString())
                .emit('joinedRoom', { message: 'success' });
        } else {
            this.server.emit('joinRoomFailed', {
                message: 'Faild to join Room',
            });
        }
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() leaveRoom: LeaveRoomDto,
    ) {
        const token = client.handshake.headers.authorization;

        const response = await this.chatService.handleLeaveRoom(
            token,
            leaveRoom,
        );
        console.log(response);

        if (response === RoomStatus.USERROOMEXISTED) {
            client.leave(leaveRoom.room_name);
            console.log(client.rooms);

            this.server.emit('leavedRoom', {
                message: 'Da roi cuoc tro chuyen',
            });
        } else {
            this.server.emit('leavedRoomFailed', {
                message: 'Roi cuoc tro chuyen that bai',
            });
        }
    }

    @SubscribeMessage('joinChat')
    async handleJoinChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() joinChat: JoinRoomDto,
    ) {
        const token = client.handshake.headers.authorization;

        if (client.rooms.has(joinChat.room_name)) {
            const response = await this.chatService.handleJoinChat(
                token,
                joinChat,
            );

            if (response === ConnectionStatus.JOINEDCHAT) {
                this.server.emit('joinedChat', {
                    message: 'User da join chat',
                });
            } else {
                this.server.emit('joinChatFailed', {
                    message: 'User join chat that bai',
                });
            }
        } else {
            this.server.emit('joinChatFailed', {
                message: 'User chua join room ',
            });
        }
    }

    @SubscribeMessage('leaveChat')
    async handleLeaveChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() leaveChat: JoinRoomDto,
    ) {
        const token = client.handshake.headers.authorization;

        if (client.rooms.has(leaveChat.room_name)) {
            const response = await this.chatService.handleLeaveChat(
                token,
                leaveChat,
            );

            if (response === ConnectionStatus.LEAVEDCHAT) {
                this.server.emit('leavedChat', {
                    message: 'User da join chat',
                });
            } else {
                this.server.emit('leaveChatFailed', {
                    message: 'User join chat that bai',
                });
            }
        } else {
            this.server.emit('leaveChatFailed', {
                message: 'User chua join room ',
            });
        }
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() sendMessage: SendMessageDto,
    ) {
        const token = client.handshake.headers.authorization;

        if (client.rooms.has(sendMessage.room_name)) {
            const StartedChat: any = await this.chatService.handleSendMessage(
                token,
                sendMessage,
            );

            this.server
                .to(sendMessage.room_name?.toString())
                .emit('onMessage', {
                    socketId: client.id,
                    msg: 'NEW MESSAGE',
                    content: sendMessage.content,
                });

            this.server.to(StartedChat).emit('onMessageLeavedChat', {
                message: 'Ban co thong bao moi',
            });
        } else {
            this.server.emit('onMessageFailed', {
                message: 'send message failed',
            });
        }
    }

    @SubscribeMessage('reactMessage')
    async handleReactionMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() reactionMessage: ReactionMessageDto,
    ) {
        const token = client.handshake.headers.authorization;

        if (client.rooms.has(reactionMessage.room_name)) {
            const response: any = await this.chatService.handleReactionMessage(
                token,
                reactionMessage,
            );
            if (response) {
                this.server.emit('reactedMessage', { message: response });
            } else {
                this.server.emit('reactMessageFaild', {
                    message: 'React message failed',
                });
            }
        } else {
            this.server.emit('reactMessageFaild', {
                message: 'React message failed',
            });
        }
    }
}
