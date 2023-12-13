import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../constants/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleAuthGuard } from '../guards/role-auth.guard';

export function AuthGuard(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RoleAuthGuard),
  );
}
