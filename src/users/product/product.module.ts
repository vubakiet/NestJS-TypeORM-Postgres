import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { ProductEntity } from 'src/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ProductEntity])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
