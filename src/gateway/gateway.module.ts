import { Module } from '@nestjs/common';
import { ChatGatewayModule } from './chat-gateway/chat-gateway.module';

@Module({
  imports: [ChatGatewayModule]
})
export class GatewayModule {}
