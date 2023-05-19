import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
