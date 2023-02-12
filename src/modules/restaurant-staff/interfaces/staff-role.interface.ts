import type { BaseEntity } from '@/common/entities/base.entity';
import type { UserRoleType } from '@/modules/user/enums/user-role.enum';

export interface StaffRole extends BaseEntity {
  userId: number;
  role: UserRoleType | null;
  restaurantId: number;
}