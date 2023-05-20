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
    @Column({ nullable: true })
    permission: string;
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
}
