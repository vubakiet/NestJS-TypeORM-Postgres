import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CommentPostDto } from './dtos/comment-post.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CommentStatus } from 'src/enum';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(UserEntity)
        private userRepositpory: Repository<UserEntity>,
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
    ) {}

    async commentPost(userId: number, commnetPostDto: CommentPostDto) {
        const { postId, comment } = commnetPostDto;

        const post = await this.postRepository.findOneBy({
            id: postId,
        });

        if (!post) {
            throw new HttpException(
                'Khong ton tai bai viet',
                HttpStatus.BAD_REQUEST,
            );
        }

        const commentCreated = this.commentRepository.create({
            comment: comment,
            user: { id: userId },
            post: { id: postId },
        });

        const commentSaved = await this.commentRepository.save(commentCreated);

        return commentSaved;
    }

    async updateComment(userId: number, updateCommentDto: UpdateCommentDto) {
        const { commentId, comment } = updateCommentDto;

        const commentPost = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user', 'post.userId'],
        });

        if (!commentPost) {
            throw new HttpException(
                'Khong ton tai binh luan',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (commentPost.user.id != userId) {
            throw new HttpException(
                'Ban khong the sua binh luan nay',
                HttpStatus.FORBIDDEN,
            );
        } else {
            await this.commentRepository.update(
                {
                    id: commentPost.id,
                },
                { comment: comment },
            );
        }

        return updateCommentDto;
    }

    async deleteComment(userId: number, commentId: number) {
        const comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
            },
            relations: ['user', 'post.userId'],
        });

        console.log(comment);

        if (!comment) {
            throw new HttpException(
                'Khong ton tai binh luan',
                HttpStatus.BAD_REQUEST,
            );
        }

        const ownerPost = comment.post.userId.id;

        if (userId == ownerPost) {
            await this.commentRepository.update(
                {
                    id: commentId,
                },
                { status: CommentStatus.DELETED },
            );

            return 'Da xoa comment';
        } else {
            if (comment.user.id != userId) {
                throw new HttpException(
                    'Ban khong the xoa bai viet',
                    HttpStatus.FORBIDDEN,
                );
            } else {
                await this.commentRepository.update(
                    {
                        id: commentId,
                    },
                    { status: CommentStatus.DELETED },
                );

                return 'Da xoa comment';
            }
        }
    }

    async getCommentsbyPostId(postId: number) {
        const post = await this.postRepository.findOneBy({ id: postId });

        if (!post) {
            throw new HttpException(
                'Khong ton tai bai Post',
                HttpStatus.BAD_REQUEST,
            );
        }

        const commentsByPostId = await this.commentRepository.find({
            where: {
                post: {
                    id: postId,
                },
            },
            relations: { user: true },
        });

        return commentsByPostId;
    }
}
