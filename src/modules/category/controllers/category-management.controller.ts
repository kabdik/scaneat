import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { UseAuth } from '@/common/decorators/auth.decorator';
import type { Product } from '@/modules/product/interface/product.interface';
import { ProductService } from '@/modules/product/product.service';

import { UserRoleType } from '../../user/enums/user-role.enum';
import { CategoryService } from '../category.service';
import { AddCategoryBodyDto } from '../dto/add-category.body.dto';
import { UpdateCategoryBodyDto } from '../dto/update-category.body.dto';
import type { Category } from '../interfaces/category.interface';

@UseAuth(UserRoleType.RESTAURANT_OWNER)
@Controller('management/category')
export class CategoryManagementController {
  constructor(
    private readonly categoryService:CategoryService,
    private readonly productService:ProductService,
  ) {}

  @Get('/:categoryId/product')
  public async getCategoryProducts(@Param('categoryId') categoryId:number):Promise<Product[]> {
    return this.productService.getCategoryProducts(categoryId);
  }

  @Post('/:restaurantId')
  public async addCategory(
    @Param('restaurantId') restaurantId:number,
      @Body() data:AddCategoryBodyDto,
  ): Promise<Category> {
    return this.categoryService.addCategory({ ...data, restaurantId });
  }

  @Delete('/:categoryId')
  public async deleteCategory(@Param('categoryId') categoryId:number): Promise<void> {
    return this.categoryService.deleteCategory(categoryId);
  }

  @Patch('/:categoryId')
  public async updateCategory(@Param('categoryId') categoryId:number, @Body() data:UpdateCategoryBodyDto):Promise<void> {
    return this.categoryService.updateCategory(categoryId, data);
  }
}
