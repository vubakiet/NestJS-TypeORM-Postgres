import { Body, Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { getUser } from '../decorator';

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Get('get-messagesByRoomId')
    async getMessagesByRoomId(@getUser() userId: number, @Body() body: any) {
        return this.messageService.getMessagesByRoomId(userId, body.roomId);
    }
}
