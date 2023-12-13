import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    try {
      const { user } = context.switchToHttp().getRequest();

      if (!roles || roles.length === 0) {
        return true;
      }

      if (user.isAdmin) {
        return true;
      }

      if (roles.includes(user.role)) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}
