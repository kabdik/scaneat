import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UseAuth } from '@/common/decorators/auth.decorator';

import { UserRoleType } from '../../user/enums/user-role.enum';
import { CategoryService } from '../category.service';
import { AddCategoryBodyDto } from '../dto/add-category.body.dto';
import { UpdateCategoryBodyDto } from '../dto/update-category.body.dto';
import type { Category } from '../interfaces/category.interface';

@UseAuth(UserRoleType.RESTAURANT_OWNER)
@Controller('restaurant/:restaurantId/category')
export class CategoryController {
  constructor(
    private readonly categoryService:CategoryService,
  ) {}

  @ApiOperation({ summary: 'Get categories of restaurant for owner' })
  @Get('')
  public async getRestaurantCategories(@Param('restaurantId') restaurantId:number):Promise<Category[]> {
    return this.categoryService.getCategories(restaurantId);
  }

  @ApiOperation({ summary: 'Add category to restaurant for owner' })
  @Post('')
  public async addCategory(
    @Param('restaurantId') restaurantId:number,
      @Body() data:AddCategoryBodyDto,
  ): Promise<Category> {
    return this.categoryService.addCategory({ ...data, restaurantId });
  }

  @ApiOperation({ summary: 'Delete category of restaurant for owner' })
  @Delete('/:categoryId')
  public async deleteCategory(@Param('categoryId') categoryId:number): Promise<void> {
    return this.categoryService.deleteCategory(categoryId);
  }

  @ApiOperation({ summary: 'Update category of restaurant for owner' })
  @Patch('/:categoryId')
  public async updateCategory(@Param('categoryId') categoryId:number, @Body() data:UpdateCategoryBodyDto):Promise<void> {
    return this.categoryService.updateCategory(categoryId, data);
  }
}
