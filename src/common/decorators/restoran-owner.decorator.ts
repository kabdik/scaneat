import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RestaurantCategoryGuard } from '@/modules/auth/guards/category.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RestaurantGuard } from '@/modules/auth/guards/restaurant.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import type { UserRoleType } from '@/modules/user/enums/user-role.enum';

export const RestauranOwner = (...roles:UserRoleType[]):ReturnType<typeof applyDecorators> => applyDecorators(
  SetMetadata('roles', roles),
  UseGuards(JwtAuthGuard, RolesGuard, RestaurantGuard, RestaurantCategoryGuard),
);
