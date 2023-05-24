import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ReactEnity } from 'src/entities/react.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, ReactEnity])],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
