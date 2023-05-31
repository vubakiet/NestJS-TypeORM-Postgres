import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway.gateway';
import { ChatGatewayService } from './chat-gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { RoomEntity } from 'src/entities/room.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { ConnectionEntity } from 'src/entities/connection.entity';
import { ReactionMessageEntity } from 'src/entities/reaction-message.entity';
import { EmojiEntity } from 'src/entities/emoji.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RoomEntity,
            MessageEntity,
            ConnectionEntity,
            ReactionMessageEntity,
            EmojiEntity,
        ]),
    ],
    providers: [ChatGateway, ChatGatewayService],
})
export class ChatGatewayModule {}
