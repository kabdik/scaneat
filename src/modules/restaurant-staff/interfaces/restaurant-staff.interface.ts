import type { BaseEntity } from '@/common/entities/base.entity';

export interface RestaurantStaff extends BaseEntity {
  userId: number;
  photoId: number | null;
}

export interface ChangeStaffUser {
  photoId: number;
  name: string;
  surname: string;
  phone: string;
}
