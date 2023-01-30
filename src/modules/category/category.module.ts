import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './category.service';
import { CategoryManagementController } from './controllers/category-management.controller';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryManagementController],
})
export class CategoryModule {}
