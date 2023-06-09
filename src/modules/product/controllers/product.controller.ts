import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { RestauranOwner } from '@/common/decorators/restoran-owner.decorator';

import { AddProductBodyDto } from '../dto/add-product.body.dto';
import { UpdateProductBodyDto } from '../dto/update-product.body.dto';
import type { Product } from '../interface/product.interface';
import { ProductService } from '../product.service';

@RestauranOwner()
@Controller('restaurant/:restaurantId/product')
export class ProductController {
  constructor(private readonly productService:ProductService) {}

  @ApiOperation({ summary: 'Add product to restaurant for owner' })
  @Post('')
  public async addProduct(
    @Body() data:AddProductBodyDto,
      @Param('restaurantId') restaurantId:number,
  ): Promise<Product> {
    return this.productService.addProduct({ ...data, restaurantId });
  }

  @ApiOperation({ summary: 'Delete product of restaurant for owner' })
  @Delete('/:productId')
  public async deleteProduct(@Param('productId') productId:number): Promise<void> {
    return this.productService.deleteProduct(productId);
  }

  @ApiOperation({ summary: 'Delete update of restaurant for owner' })
  @Patch('/:productId')
  public async updateProduct(@Param('productId') productId:number, @Body() data:UpdateProductBodyDto): Promise<void> {
    return this.productService.updateProduct(productId, data);
  }

  @ApiOperation({ summary: 'Get products of restaurant category for owner' })
  @Get('')
  public async getCategoryProducts(
    @Param('restaurantId') restaurantId:number,
      @Query('categoryId') categoryId?:number,
      @Query('name') name?:string,
  ):Promise<Product[]> {
    return this.productService.getCategoryProducts(restaurantId, categoryId, name);
  }
}
