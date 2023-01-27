import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import _ from 'lodash';
import type { Observable } from 'rxjs';

import type { UserRoleType } from '@/modules/user/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:Reflector) {}
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (_.isEmpty(requiredRoles)) return true;

    const { user }:Request = context.switchToHttp().getRequest();
    if (!user?.role) {
      return false;
    }
    return requiredRoles.includes(user.role);
  }
}
