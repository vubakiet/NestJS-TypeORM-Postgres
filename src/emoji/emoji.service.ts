import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmojiEntity } from 'src/entities/emoji.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmojiService {
    constructor(
        @InjectRepository(EmojiEntity)
        private emojioRepository: Repository<EmojiEntity>,
    ) {}

    async createEmoji(name: string) {
        const emoji = await this.emojioRepository.findOneBy({ name });

        if (emoji) {
            throw new HttpException('Emoji da ton tai', HttpStatus.BAD_REQUEST);
        }

        const emojiCreated = await this.emojioRepository.create({
            name,
        });

        return await this.emojioRepository.save(emojiCreated);
    }

    async getAllEmoji() {
        return await this.emojioRepository.find();
    }

    async deleteEmoji(emojiId: number) {
        const emoji = await this.emojioRepository.findBy({ id: emojiId });

        if (!emoji) {
            throw new HttpException(
                'Khong ton tai emoji',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.emojioRepository.delete({ id: emojiId });

        return 'Xoa emoji thanh cong';
    }
}
