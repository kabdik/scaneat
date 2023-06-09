import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { AddCategoryWithRestaurantDto } from './dto/add-category.body.dto';
import type { UpdateCategoryBodyDto } from './dto/update-category.body.dto';
import { CategoryEntity } from './entities/category.entity';
import type { Category, CategoryWithProduct } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) {}

  public async getCategoriesWithProducts(restaurantId:number):Promise<CategoryWithProduct[]> {
    return <CategoryWithProduct[]> await this.categoryRepository.query(`
      SELECT c.id, c.name, c.description, c."isActive", c."isDeleted",
        json_agg(json_build_object(
                        'id',p.id, 'name',p.name, 'description', p.description, 'restaurantId', p."restaurantId",
                        'price', p.price, 'unitPrice',p."unitPrice",'isDeleted',p."isDeleted",
                        'photoId',ph.id, 'photoUrl', ph."originalUrl", 'thumbnails', ph."thumbnails"
                )) as products
        FROM ${TableName.CATEGORY} as c
        LEFT JOIN ${TableName.PRODUCT} as p 
        ON c.id = p."categoryId"
        LEFT JOIN ${TableName.PHOTO} as ph
        ON p."photoId" = ph.id
        WHERE c."restaurantId"=$1 
        AND c."isActive" = true
        AND c."isDeleted" = false
        AND p."isDeleted" = false
        GROUP BY c.id
      `, [restaurantId]);
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

  public async getCategories(restaurantId:number):Promise<Category[]> {
    return <Category[]> await this.categoryRepository.query(
      `
      SELECT c.*, COUNT(deleted_false_p.id) AS "numberOfProducts"
        FROM ${TableName.CATEGORY} AS c LEFT JOIN (
                                            SELECT pr.id,pr."categoryId"
                                            from ${TableName.PRODUCT} as pr
                                            where pr."isDeleted" = false
                                            ) as deleted_false_p 
        ON c.id = deleted_false_p."categoryId"
        WHERE c."restaurantId"=$1 AND c."isDeleted" = false
        GROUP BY c.id
        `,
      [restaurantId],
    );
  }

  public async deleteCategory(cateroryId:number):Promise<void> {
    const category = await this.categoryRepository.findOneBy({ id: cateroryId });
    if (!category) {
      throw new NotFoundException('Категории с таким id не существует');
    }
    category.isDeleted = true;
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  public async updateCategory(categoryId:number, data:UpdateCategoryBodyDto):Promise<void> {
    const { affected } = await this.categoryRepository.update(categoryId, data);
    if (affected === 0) {
      throw new NotFoundException('Категории с таким id не существует');
    }
  }
}
