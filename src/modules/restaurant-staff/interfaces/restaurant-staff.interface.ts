import type { BaseEntity } from '@/common/entities/base.entity';

export interface RestaurantStaff extends BaseEntity {
  userId: number;
  photoId: number | null;
}

export interface ChangeStaffUserData {
  photoId: number;
  name: string;
  surname: string;
  phone: string;
}

export interface CreateStaffUserData {
  photoId?: number;
  name: string;
  surname: string;
  email: string;
  phone?: string;
}
