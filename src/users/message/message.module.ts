import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { RoomEntity } from 'src/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, RoomEntity])],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
