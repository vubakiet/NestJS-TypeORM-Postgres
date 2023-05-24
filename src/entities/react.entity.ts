import { ReactionStatus } from 'src/enum/reactions-status.enum';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('reacts')
export class ReactEnity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    reactions: ReactionStatus;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.id)
    post: PostEntity;
}
