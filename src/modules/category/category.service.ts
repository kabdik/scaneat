import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CategoryEntity } from './entities/category.entity';
import type { CategoryWithProduct } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) {}

  public async getCategoriesWithProducts(restaurantId:number):Promise<CategoryWithProduct[]> {
    return <CategoryWithProduct[]> await this.categoryRepository.find({
      where: { restaurantId },
      relations: ['products'] });
  }
}
