import { Module } from '@nestjs/common';
import { EmojiController } from './emoji.controller';
import { EmojiService } from './emoji.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmojiEntity } from 'src/entities/emoji.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmojiEntity])],
  controllers: [EmojiController],
  providers: [EmojiService]
})
export class EmojiModule {}
