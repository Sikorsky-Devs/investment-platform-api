import { Role } from '@prisma/client';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../database/prisma.service';
import { Request } from 'express';
import { UnauthorizedException } from '../../../utils/exception/unauthorized.exception';
import { ForbiddenException } from '../../../utils/exception/forbidden.exception';

export function AuthGuard(role?: Role): Type<CanActivate> {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly prisma: PrismaService,
    ) {}

    private readonly rolePriority = [Role.ADMIN, Role.USER];

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.getTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException();
      }

      let payload: { sub: string };

      try {
        payload = await this.jwtService.verifyAsync(token);
      } catch {
        throw new UnauthorizedException();
      }

      const user = await this.prisma.user.findFirst({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          avatarLink: true,
        },
      });
      if (!user) {
        throw new UnauthorizedException();
      }

      if (
        role &&
        this.rolePriority.indexOf(user.role) > this.rolePriority.indexOf(role)
      ) {
        throw new ForbiddenException();
      }

      request['user'] = user;

      return true;
    }

    private getTokenFromHeader(req: Request): string | undefined {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
    }
  }
  return mixin(AuthGuardMixin);
}
