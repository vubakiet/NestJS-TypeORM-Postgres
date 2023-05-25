import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';
import { CommentStatus } from 'src/enum';

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column({ default: CommentStatus.AVAILABLE })
    status: CommentStatus;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'from_user' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.id)
    post: PostEntity;
}
