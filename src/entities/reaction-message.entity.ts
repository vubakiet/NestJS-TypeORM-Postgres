import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmojiEntity } from './emoji.entity';
import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

@Entity('reaction_message')
export class ReactionMessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: 1 })
    quantity: number;

    @ManyToOne(() => EmojiEntity, (emoji) => emoji.id)
    emoji: EmojiEntity;

    @ManyToOne(() => MessageEntity, (message) => message.id)
    message: MessageEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;
}
