import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { OrderGuard } from '@/modules/auth/guards/order.guard';
import { RestaurantStaffGuard } from '@/modules/auth/guards/restaurant-staff.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import type { UserRoleType } from '@/modules/user/enums/user-role.enum';

export const RestaurantStaff = (...roles:UserRoleType[]):ReturnType<typeof applyDecorators> => applyDecorators(
  SetMetadata('roles', roles),
  UseGuards(JwtAuthGuard, RolesGuard, RestaurantStaffGuard, OrderGuard),
);
