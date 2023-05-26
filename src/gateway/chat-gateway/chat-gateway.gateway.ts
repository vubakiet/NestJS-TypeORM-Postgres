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

interface User {
    id: string;
    name: string;
}

interface JoinConversationDto{
    conversation_id: number;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway
    implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
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

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinConversationDto){
        console.log('Joining room:', data.conversation_id?.toString());
        console.log(client.id);
        
        client.join(data.conversation_id?.toString())        
        this.server.to(data.conversation_id?.toString()).emit('JoinedRoom', {message: 'success'})
    }

    @SubscribeMessage('newMessage')
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: any,
    ) {
        console.log(payload);

        this.server.emit('onMessage', {
            socketId: client.id,
            msg: 'NEW MESSAGE',
            content: payload,
        });
    }


}
