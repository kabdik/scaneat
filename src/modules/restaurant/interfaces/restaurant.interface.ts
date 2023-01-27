import type { BaseEntity } from '@/common/entities/base.entity';

export interface Restaurant extends BaseEntity {
  name: string;
  slug: string;
  phone: string | null;
  cityId: number;
  hasTakeAway: boolean;
  hasDelivery: boolean;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  address: string | null;
}
