import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

type PermissionsProps = {
  mustHaveAll?: boolean;
  permissions: string[];
};
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const [req] = context.getArgs();

    let shallPass = false;

    const userPermissions = req?.auth?.permissions || [];

    const requiredPermissions: PermissionsProps | null =
      this.reflector.get('permissions', context.getHandler()) || null;

    if (requiredPermissions === null) {
      return true;
    }

    if (requiredPermissions.mustHaveAll) {
      shallPass = requiredPermissions.permissions.every((permission) =>
        userPermissions.includes(permission),
      );
    }

    if (requiredPermissions.mustHaveAll === false) {
      shallPass = requiredPermissions.permissions.some((permission) =>
        userPermissions.includes(permission),
      );
    }

    if (shallPass) {
      return true;
    }

    throw new ForbiddenException('Insufficient Permissions');
  }
}
