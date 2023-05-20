import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    price: string;
    @Column()
    description: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    insertedByUser?: UserEntity;

    @OneToMany(() => OrderEntity, (order) => order.products)
    productBoughtByUser?: OrderEntity;
}
