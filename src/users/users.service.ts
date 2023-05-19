import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entity/product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}

  async getUsers() {
    return await this.usersRepository.find();
  }

  async createProductByUserId(userId: number, product: CreateProductDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const newProduct = await this.productsRepository.create({
      ...product,
      user: { id: userId },
    });
    console.log(newProduct);

    await this.productsRepository.save(newProduct);
  }
}
