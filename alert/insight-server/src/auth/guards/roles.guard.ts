import { RequestWithUser } from './../auth.types';
import { Injectable, CanActivate, ExecutionContext, Logger, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants/auth.constant';
import { AuthRoleEnum } from '../constants/user.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  logger: Logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {
    //
  }

  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    // 获取当前要求的角色
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    // 没有设置角色的接口，直接通过校验
    if (requiredRoles === undefined) {
      return true;
    }

    // 没有登录的用户，直接返回403
    if (!request.user || !request.user.role) {
      throw new ForbiddenException('请先登录');
    }

    // 获取当前用户的角色
    const possessedRoles = request.user.role;

    // 超级管理员直接通过校验
    if (possessedRoles === AuthRoleEnum.SUPER_ADMIN) {
      return true;
    }

    // 用户拥有，接口要求的角色
    if (requiredRoles.includes(possessedRoles)) {
      return true;
    } else {
      throw new ForbiddenException('角色权限权限不足');
    }
  }
}
