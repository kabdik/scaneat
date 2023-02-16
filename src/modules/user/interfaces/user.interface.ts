import type { BaseEntity } from '@/common/entities/base.entity';

import type { UserRoleType } from '../enums/user-role.enum';

export interface User extends BaseEntity {
  name:string;
  surname:string | null;
  email:string | null;
  phone:string | null;
  password:string | null;
  role:UserRoleType | null;
}

export interface OrderUser {
  name:string;
  phone:string;
}
