import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { Role } from 'src/auth/enum';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
import { MessageEntity } from './message.entity';
import { ReactionMessageEntity } from './reaction-message.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true })
    firstname: string;
    @Column({ nullable: true })
    lastname: string;
    @Column({ nullable: true })
    birthday: string;
    @Column({ nullable: true })
    address: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column({ type: 'enum', enum: Role, default: Role.USER })
    permission: Role;
    @Column({ nullable: true })
    access_token: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated_at: Date;

    @OneToMany(() => ProductEntity, (product) => product.insertedByUser)
    productInserted?: ProductEntity;

    @OneToMany(() => OrderEntity, (order) => order.users)
    userBought?: OrderEntity;

    @OneToMany(() => PostEntity, (post) => post.userId)
    postCreated?: PostEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    user_comment?: CommentEntity;

    @OneToMany(() => MessageEntity, (message) => message.user)
    user_message?: MessageEntity[];

    @OneToMany(() => ReactionMessageEntity, (reactMessage) => reactMessage.user)
    reactMessage: ReactionMessageEntity;
}
