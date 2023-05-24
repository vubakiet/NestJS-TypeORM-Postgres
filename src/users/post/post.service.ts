import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UserEntity } from 'src/entities/user.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { DefaultStatus } from 'src/enum/status-default.enum';
import { ReactEnity } from 'src/entities/react.entity';
import { ReactionStatus } from 'src/enum/reactions-status.enum';
@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ReactEnity)
        private reactRepository: Repository<ReactEnity>,
    ) {}

    async getPosts() {
        return this.postRepository.find();
    }

    async getPostById(postId: number) {
        const post = this.postRepository.findOneBy({ id: postId });
        if (!post) {
            throw new HttpException(
                'Khong ton tai bai Post',
                HttpStatus.BAD_REQUEST,
            );
        }
        return this.postRepository.findOneBy({ id: postId });
    }

    async createPost(userId: number, createPostDto: CreatePostDto) {
        const { content } = createPostDto;

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'User khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        const postCreated = this.postRepository.create({
            content: content,
            userId: user,
        });
        const postSaved = await this.postRepository.save(postCreated);

        if (postSaved) {
            const postReactionCreated = this.reactRepository.create({
                user: {
                    id: userId,
                },
                reactions: ReactionStatus.DEFAULT,
                post: {
                    id: postSaved.id,
                },
            });
            await this.reactRepository.save(postReactionCreated);
        }

        return postSaved;
    }

    async updatePost(
        userId: number,
        postId: number,
        updatePostDto: UpdatePostDto,
    ) {
        const { content } = updatePostDto;

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'User khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new HttpException(
                'Post khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.postRepository.update({ id: postId }, { content: content });

        return updatePostDto;
    }

    async deletePost(userId: number, postId: number) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new HttpException(
                'User khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new HttpException(
                'Post khong ton tai',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.postRepository.update(
            { id: postId },
            { status: DefaultStatus.DELETED },
        );

        return 'Xoa thanh cong';
    }
}
