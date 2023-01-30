import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { AddCategoryWithRestaurantDto } from './dto/add-category.body.dto';
import { CategoryEntity } from './entities/category.entity';
import type { Category, CategoryWithProduct } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) {}

  public async getCategoriesWithProducts(restaurantId:number):Promise<CategoryWithProduct[]> {
    return <CategoryWithProduct[]> await this.categoryRepository.find({
      where: { restaurantId },
      relations: ['products'] });
  }

  public async addCategory(data: AddCategoryWithRestaurantDto):Promise<Category> {
    const category = await this.categoryRepository.findOneBy({
      name: data.name,
      restaurantId: data.restaurantId,
    });

    if (category) {
      throw new BadRequestException('У этого ресторана уже существует такая категория');
    }
    return <Promise<Category>> this.categoryRepository.save(data);
  }

  public async getCategories():Promise<Category[]> {
    return <Category[]> await this.categoryRepository.query(
      `SELECT c.*, COUNT(pr.id) AS "numberOfProducts"
        FROM ${TableName.CATEGORY} AS c LEFT JOIN ${TableName.PRODUCT} AS pr 
        ON c.id = pr."categoryId"
        GROUP BY c.id`,
    );
  }
}
