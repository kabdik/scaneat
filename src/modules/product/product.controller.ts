import { Body, Controller, Param, Post } from '@nestjs/common';

import { UseAuth } from '@/common/decorators/auth.decorator';

import { UserRoleType } from '../user/enums/user-role.enum';
import { AddProductBodyDto } from './dto/add-product.body.dto';
import type { Product } from './interface/product.interface';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService:ProductService) {}

  @UseAuth(UserRoleType.RESTAURANT_OWNER)
  @Post('/:restaurantId/:categoryId')
  public async addProduct(
    @Body() data:AddProductBodyDto,
      @Param('categoryId') categoryId:number,
      @Param('restaurantId') restaurantId:number,
  ): Promise<Product> {
    return this.productService.addProduct({ ...data, categoryId, restaurantId });
  }
}
