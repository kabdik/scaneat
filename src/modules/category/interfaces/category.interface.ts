import type { BaseEntity } from '@/common/entities/base.entity';
import type { Product } from '@/modules/product/interface/product.interface';

export interface Category extends BaseEntity {
  name: string;
  restaurantId: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface CategoryWithProduct extends Category {
  products: Product[];
}
