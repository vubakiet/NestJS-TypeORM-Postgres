import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    users: UserEntity;

    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    products: ProductEntity;
}
