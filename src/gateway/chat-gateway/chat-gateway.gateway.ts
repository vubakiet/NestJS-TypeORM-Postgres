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

    handleConnection(client: Socket, ...args: any[]) {
        const user: User = {
            id: client.id,
            name: `User: ${client.id}`,
        };

        this.connectedUsers.push(user);
        this.server.emit('users', this.connectedUsers);
    }

    handleDisconnect(client: Socket) {
        const index = this.connectedUsers.findIndex(
            (user) => user.id === client.id,
        );
        if (index !== -1) {
            this.connectedUsers.splice(index, 1);
            this.server.emit('users', this.connectedUsers);
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
            client.join(joinRoom.room_name?.toString());
        }

        // console.log(client.rooms);

        const StartedChat = await this.chatService.handleJoinRoom(
            token,
            joinRoom,
        );

        // console.log(StartedChat);

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

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() sendMessage: SendMessageDto,
    ) {
        const token = client.handshake.headers.authorization;

        const StartedChat = await this.chatService.handleSendMessage(
            token,
            sendMessage,
        );
        console.log(StartedChat);
        

        if (StartedChat === RoomStatus.STARTCHAT) {
            this.server
                .to(sendMessage.room_name?.toString())
                .emit('onMessage', {
                    socketId: client.id,
                    msg: 'NEW MESSAGE',
                    content: sendMessage.content,
                });
        } else {
            this.server.emit('onMessageFailed', {
                message: 'send message failed',
            });
        }
    }
}
