import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column()
    birthday: string;
    @Column()
    address: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    permission: string;
    @Column()
    access_token: string;

    @OneToMany(() => OrderEntity, (order) => order.users)
    userBought: OrderEntity[];
}
