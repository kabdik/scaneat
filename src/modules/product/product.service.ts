import { BadRequestException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { AddProductWithCategoryDto } from './dto/add-product.body.dto';
import type { UpdateProductBodyDto } from './dto/update-product.body.dto';
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

  public async deleteProduct(productId:number):Promise<void> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new BadRequestException('Продукта с таким id не существует');
    }
    product.isDeleted = true;
    await this.productRepository.save(product);
  }

  public async updateProduct(productId:number, data:UpdateProductBodyDto):Promise<void> {
    const { affected } = await this.productRepository.update(productId, data);
    if (affected === 0) {
      throw new BadRequestException('Продукта с таким id не существует');
    }
  }

  public async getCategoryProducts(@Param('categoryId') categoryId:number):Promise<Product[]> {
    return <Promise<Product[]>> this.productRepository.manager.query(`
      SELECT pr.*, p.*
        FROM ${TableName.PRODUCT} AS pr LEFT JOIN ${TableName.PHOTO} AS p 
        ON pr."photoId" = p.id
        where pr."categoryId" = $1
    `, [categoryId]);
  }
}
