import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway.gateway';
import { ChatGatewayService } from './chat-gateway.service';

@Module({
  providers: [ChatGateway, ChatGatewayService]
})
export class ChatGatewayModule {}
