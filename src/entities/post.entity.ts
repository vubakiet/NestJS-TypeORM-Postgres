import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { DefaultStatus } from 'src/enum/status-default.enum';
import { ReactEnity } from './react.entity';

@Entity('posts')
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    content: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'from_userId' })
    userId: UserEntity;

    @Column({ nullable: true, default: DefaultStatus.AVAILABLE })
    status: DefaultStatus;

    @OneToMany(() => ReactEnity, (react) => react.reactions)
    reactions: ReactEnity[];

    // @Column({
    //     type: Number,
    //     array: true,
    //     nullable: true,
    // })
    // to_userId: number[];
}
