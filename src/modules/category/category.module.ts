import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from '../product/product.module';
import { CategoryService } from './category.service';
import { CategoryManagementController } from './controllers/category-management.controller';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), ProductModule],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryManagementController],
})
export class CategoryModule {}
