import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReactionMessageEntity } from './reaction-message.entity';

@Entity('tbl_emoji')
export class EmojiEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @OneToMany(
        () => ReactionMessageEntity,
        (reactMessage) => reactMessage.emoji,
    )
    reactionMessage: ReactionMessageEntity;
}
