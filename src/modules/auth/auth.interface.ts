import type { UserRoleType } from '../user/enums/user-role.enum';

export interface UserPayload {
  userId: number;
  role: UserRoleType | null;
}

export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: number;
  role: UserRoleType | null;
}

export interface UserLogin {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: UserRoleType;
  password: string;
}
