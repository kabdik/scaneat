import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { UseAuth } from '@/common/decorators/auth.decorator';

import { UserRoleType } from '../../user/enums/user-role.enum';
import { AddProductBodyDto } from '../dto/add-product.body.dto';
import { UpdateProductBodyDto } from '../dto/update-product.body.dto';
import type { Product } from '../interface/product.interface';
import { ProductService } from '../product.service';

@UseAuth(UserRoleType.RESTAURANT_OWNER)
@Controller('management/product')
export class ProductManagementController {
  constructor(private readonly productService:ProductService) {}

  @Post('/:restaurantId/:categoryId')
  public async addProduct(
    @Body() data:AddProductBodyDto,
      @Param('categoryId') categoryId:number,
      @Param('restaurantId') restaurantId:number,
  ): Promise<Product> {
    return this.productService.addProduct({ ...data, categoryId, restaurantId });
  }

  @Delete('/:productId')
  public async deleteProduct(@Param('productId') productId:number): Promise<void> {
    return this.productService.deleteProduct(productId);
  }

  @Patch('/:productId')
  public async updateProduct(@Param('productId') productId:number, @Body() data:UpdateProductBodyDto): Promise<void> {
    return this.productService.updateProduct(productId, data);
  }
}
