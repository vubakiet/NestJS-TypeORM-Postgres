import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

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

  @OneToMany(() => ProductEntity, (product) => product.user)
  products: ProductEntity[];
}
