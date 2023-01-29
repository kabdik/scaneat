import { Body, Controller, Param, Post } from '@nestjs/common';

import { UseAuth } from '@/common/decorators/auth.decorator';

import { UserRoleType } from '../user/enums/user-role.enum';
import { CategoryService } from './category.service';
import { AddCategoryBodyDto } from './dto/add-category.body.dto';
import type { Category } from './interfaces/category.interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService:CategoryService) {}

  @UseAuth(UserRoleType.RESTAURANT_OWNER)
  @Post('/:restaurantId')
  public async addCategory(
    @Param('restaurantId') restaurantId:number,
      @Body() data:AddCategoryBodyDto,
  ): Promise<Category> {
    return this.categoryService.addCategory({ ...data, restaurantId });
  }
}
