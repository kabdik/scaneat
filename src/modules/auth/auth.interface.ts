import type { RoleType } from '../user/enums/user-role.enum';

export interface UserPayload {
  userId: number;
  patientId?: number;
  doctorId?: number;
  role: RoleType | null;
}
