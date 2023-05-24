import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { ReactEnity } from 'src/entities/react.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ReactionStatus } from 'src/enum/reactions-status.enum';
import { Repository } from 'typeorm';

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
        console.log(postId);

        const reactsUserPost = await this.reactRepository.find({
            where: {
                post: {
                    id: postId,
                },
            },
            relations: { user: true },
        });


        const usersReaction = reactsUserPost.map((react) => react.user);

        console.log(usersReaction);

        const reactionsArr = reactsUserPost.map((react) => react.reactions);

        const countUnlike = reactionsArr.filter((x) => x == 0).length;
        const countLike = reactionsArr.filter((x) => x == 1).length;

        const like = `So nguoi like: ${countLike}`;
        const unlike = `So nguoi Unlike: ${countUnlike}`;
        const totalReactions = `Tong so nguoi reaction: ${reactionsArr.length}`;

        return { totalReactions, like, unlike };
    }
}
