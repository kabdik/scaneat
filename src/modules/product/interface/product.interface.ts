import type { BaseEntity } from '@/common/entities/base.entity';

export interface Product extends BaseEntity {
  name: string;
  description: string;
  categoryId: number;
  restaurantId: number;
  unitPrice: number;
  price: number;
  photoId: number | null;
  isDeleted: boolean;
}
