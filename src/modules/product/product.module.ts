import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductManagementController } from './controllers/product-management.controller';
import { ProductEntity } from './entitites/product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductManagementController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
