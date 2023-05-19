import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;
  @Column()
  price: string;
  @Column()
  description: string;
}
