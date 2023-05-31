import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmojiService } from './emoji.service';

@Controller('emoji')
export class EmojiController {
    constructor(private emojiService: EmojiService) {}

    @Post('createEmoji')
    async createEmoji(@Body() body: any) {
        return await this.emojiService.createEmoji(body.name);
    }

    @Post('deleteEmoji/:emojiId')
    async deleteEmoji(@Param() emojiId: number) {
        return await this.emojiService.deleteEmoji(emojiId['emojiId']);
    }

    @Get('getAllEmoji')
    async getAllEmoji() {
        return await this.emojiService.getAllEmoji();
    }
}
