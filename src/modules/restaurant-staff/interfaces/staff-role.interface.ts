import type { BaseEntity } from '@/common/entities/base.entity';
import type { UserRoleType } from '@/modules/user/enums/user-role.enum';
import type { User } from '@/modules/user/interfaces/user.interface';

export interface StaffRole extends BaseEntity {
  restaurantStaffId: number;
  role: UserRoleType | null;
  restaurantId: number;
}

export interface GetStaff extends User, StaffRole {}
