import type { BaseEntity } from '@/common/entities/base.entity';

import type { UserRoleType } from '../enums/user-role.enum';

export interface User extends BaseEntity {
  name:string;
  surname:string;
  email:string;
  phone:string | null;
  password:string;
  role:UserRoleType | null;
}
