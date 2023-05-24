import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactEnity } from 'src/entities/react.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ReactEnity, PostEntity, UserEntity])],
    controllers: [ReactionController],
    providers: [ReactionService],
})
export class ReactionModule {}
