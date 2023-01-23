import type { BaseEntity } from '@/common/entities/base.entity';

import type { RestaurnatStaffRole } from '../enums/restaurant-staff-role.enum';

export interface RestaurantStaff extends BaseEntity {
  userId: number;
  restaurantId: number;
  role: RestaurnatStaffRole;
}
