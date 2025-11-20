import { AzureService } from 'src/auth/services/azure.service';
import { ConfigService } from '@nestjs/config';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { JWT_TOKEN_KEY_FOR_COOKIES } from '../constants/auth.constant';
import { UserService } from '../services/user.service';
import { AuthRoleEnum } from '../constants/user.constant';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly azureService: AzureService,
  ) {
    //
  }

  /**
   * 服务端登录的方式
   * 这里重定向到Azure AD认证页面
   * @param res
   * @returns
   */
  @Get('login')
  async login(@Res() res, @Query('redirect') redirect: string) {
    // 这里需要设置重定向的地址
    const authUrl = await this.azureService.getAuthUrl(redirect);
    res.redirect(authUrl);
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie(JWT_TOKEN_KEY_FOR_COOKIES);
    res.json({ message: '登出成功' });
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response, @Query('state') state: string) {
    console.log('callback.req.query.state', state);
    const data = await this.azureService.getTokenByRaw(code);
    const { accessToken, refreshToken } = data;
    const account = JSON.parse(atob(accessToken.split('.')[1]));
    const userEmail = account?.upn;
    try {
      // 保存用户信息
      await this.userService.updateUserToken(userEmail, {
        accessToken,
        refreshToken,
        lastLoginAt: new Date(),
      });
    } catch {
      await this.userService.createUser({
        role: AuthRoleEnum.USER,
        email: account.upn,
        name: account.name,
        lastLoginAt: new Date(),
        accessToken,
        refreshToken,
      });
    }
    // 设置cookie
    res.cookie(JWT_TOKEN_KEY_FOR_COOKIES, accessToken, {
      expires: new Date(Date.now() + AuthService.EXPIRED_DURATION),
      httpOnly: true,
    });
    // Azure AD认证成功后，重定向到前端页面
    res.redirect(this.configService.get<string>('INSIGHT_URL') + decodeURIComponent(state));
  }
}
