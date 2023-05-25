import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { PostEntity } from 'src/entities/post.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CommentEntity, UserEntity, PostEntity]),
    ],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
