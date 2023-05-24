import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { ReactEnity } from 'src/entities/react.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ReactionStatus } from 'src/enum/reactions-status.enum';
import { Repository } from 'typeorm';
import { UserResponse } from '../user.response';

@Injectable()
export class ReactionService {
    constructor(
        @InjectRepository(ReactEnity)
        private reactRepository: Repository<ReactEnity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
    ) {}

    async reactPost(userId: number, postId: number) {
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

        const reactUserPost = await this.reactRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
                post: {
                    id: postId,
                },
            },
        });

        if (!reactUserPost) {
            const reactCreated = this.reactRepository.create({
                reactions: ReactionStatus.LIKE,
                user: {
                    id: userId,
                },
                post: {
                    id: postId,
                },
            });

            const reactSaved = await this.reactRepository.save(reactCreated);

            return reactSaved;
        } else {
            await this.reactRepository.update(
                {
                    id: reactUserPost.id,
                },
                {
                    reactions:
                        reactUserPost.reactions == ReactionStatus.LIKE
                            ? ReactionStatus.UNLIKE
                            : ReactionStatus.LIKE,
                },
            );

            return 'Da cap nhat reactions';
        }
    }

    async getReactionsByPostId(postId: number) {
        const reactsUserPost = await this.reactRepository.find({
            where: {
                post: {
                    id: postId,
                },
            },
            relations: { user: true },
        });

        const usersReaction = UserResponse.mapToList(
            reactsUserPost.map((react) => react.user),
        );

        const reactionsArr = reactsUserPost.map((react) => react.reactions);

        let countLike = 0;
        let countUnlike = 0;

        console.log(reactionsArr);

        reactionsArr.forEach((react) => {
            if (react == 0) {
                countUnlike++;
            }
            if (react == 1) {
                countLike++;
            }
        });

        const like = `So nguoi like: ${countLike}`;
        const unlike = `So nguoi Unlike: ${countUnlike}`;
        const totalReactions = `Tong so nguoi reaction: ${reactionsArr.length}`;

        return { usersReaction, totalReactions, like, unlike };
    }
}
