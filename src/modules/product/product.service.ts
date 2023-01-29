import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import type { AddProductWithCategoryDto } from './dto/add-product.body.dto';
import { ProductEntity } from './entitites/product.entity';
import type { Product } from './interface/product.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

  ) {}

  public async addProduct(data:AddProductWithCategoryDto):Promise<Product> {
    const product = await this.productRepository.findOne({ where: {
      restaurantId: data.restaurantId,
      name: data.name,
    } });
    if (product) {
      throw new BadRequestException('The product with such name already exists');
    }

    return <Promise<Product>> this.productRepository.save(data);
  }
}
