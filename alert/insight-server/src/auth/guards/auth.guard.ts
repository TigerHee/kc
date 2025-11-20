import { AuthService } from 'src/auth/services/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {
    //
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res = await this.authService.auth(context);
    return res;
  }
}
