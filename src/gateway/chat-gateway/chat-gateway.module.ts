import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway.gateway';
import { ChatGatewayService } from './chat-gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { RoomEntity } from 'src/entities/room.entity';
import { MessageEntity } from 'src/entities/message.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity, RoomEntity, MessageEntity])],  providers: [ChatGateway, ChatGatewayService]
})
export class ChatGatewayModule {}
