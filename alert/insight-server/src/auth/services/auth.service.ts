import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RequestUserInfo, RequestWithUser } from '../auth.types';
import { JWT_TOKEN_KEY_FOR_COOKIES } from '../constants/auth.constant';
import { isExistWhiteList } from '../auth.utils';
import { ApiKeysData } from '../dto/create-auth-apikeys.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AzureService } from './azure.service';
import { UserService } from './user.service';
import { ApiKeysService } from './apikeys.service';
import { KunlunLogger } from 'src/common/kunlun.logger';
import { AuthRoleEnum } from '../constants/user.constant';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  kunlunLogger = new KunlunLogger(AuthService.name);
  static EXPIRED_DURATION = 1000 * 60 * 60 * 12;

  constructor(
    private readonly jwtService: JwtService,
    private readonly azureService: AzureService,
    private readonly userService: UserService,
    private readonly apiKeysService: ApiKeysService,
  ) {
    //
  }

  async auth(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const response = context.switchToHttp().getResponse();

    let token;

    // 解析 Authorization 头部 Bearer token
    if (request.headers['authorization']) {
      const [type, _token] = request.headers['authorization'].split(' ');
      if (type === 'Bearer') {
        token = _token;
      }
    }
    // headers没有的话 从 cookies 中获取 token
    if (!token && request.cookies[JWT_TOKEN_KEY_FOR_COOKIES]) {
      token = request.cookies[JWT_TOKEN_KEY_FOR_COOKIES];
    }
    // 没有token, 且不在白名单中
    if (!token && !isExistWhiteList(request.url)) {
      throw new UnauthorizedException('没有凭证');
    }

    try {
      // 验证 APIkeys 方式的 token
      const apikeys: ApiKeysData = this.jwtService.verify(token);
      // 以下说明是 APIkeys 方式的 token，token 是合法的
      const _apikeys = await this.apiKeysService.findOne({ remark: apikeys.remark });
      request.user = {
        id: _apikeys.id,
        name: apikeys.name,
        email: '',
        role: apikeys.role,
        type: 'apikeys',
      } as RequestUserInfo;
      await this.apiKeysService.updateLastUsedAt(_apikeys.id);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.kunlunLogger.warn('APIKEYS 凭证过期: ' + error.expiredAt);
        if (isExistWhiteList(request.url)) {
          this.kunlunLogger.warn('白名单路径，跳过验证: APIKEYS 凭证过期');
          return true;
        }
        throw new UnauthorizedException('APIKEYS 凭证过期: ' + error.expiredAt);
      }

      try {
        const info = await this.azureService.verifyToken(token);
        // 以下说明是 Azure AD 方式的 token，token 是合法的
        const check = await this.userService.getUserByEmail(info.upn);
        if (!check) {
          await this.userService.createUser({
            role: AuthRoleEnum.USER,
            email: info.upn,
            name: info.name,
            lastLoginAt: new Date(),
          });
          this.kunlunLogger.warn('Azure AD 凭证验证: 用户不存在，已创建');
        }
        const user = await this.userService.getUserByEmail(info.upn);
        // 成功响应
        request.user = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          type: 'azure',
        } as RequestUserInfo;
        // this.kunlunLogger.warn('Azure AD 凭证验证成功: 正常验证流程');
        return true;
      } catch (_error) {
        // Access Token 过期
        if (_error.message === 'jwt expired') {
          this.kunlunLogger.warn('Azure AD 凭证过期');
          const account = JSON.parse(atob(token.split('.')[1]));
          const userEmail = account?.upn;
          if (!userEmail) {
            response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
              expires: new Date(0),
              httpOnly: true,
            });
            if (isExistWhiteList(request.url)) {
              this.kunlunLogger.warn('白名单路径，跳过验证: Token中用户信息不存在');
              return true;
            }
            throw new UnauthorizedException('Token异常');
          }
          const userModel = await this.userService.getUserByEmail(userEmail);
          if (!userModel) {
            response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
              expires: new Date(0),
              httpOnly: true,
            });
            if (isExistWhiteList(request.url)) {
              this.kunlunLogger.warn('白名单路径，跳过验证: 数据库中用户不存在');
              return true;
            }
            throw new UnauthorizedException('异常用户');
          }
          // 超过12h未登录，需要重新登录
          if (!userModel.lastLoginAt?.getTime()) {
            response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
              expires: new Date(0),
              httpOnly: true,
            });
            if (isExistWhiteList(request.url)) {
              this.kunlunLogger.warn('白名单路径，跳过验证: 未登录过');
              return true;
            }
            throw new UnauthorizedException('登录失效');
          }
          // 超过12h未登录，需要重新登录
          if (
            userModel.lastLoginAt &&
            new Date().getTime() - userModel.lastLoginAt.getTime() > AuthService.EXPIRED_DURATION
          ) {
            response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
              expires: new Date(0),
              httpOnly: true,
            });
            if (isExistWhiteList(request.url)) {
              this.kunlunLogger.warn('白名单路径，跳过验证: 登录过期');
              return true;
            }
            throw new UnauthorizedException('登录失效');
          }
          // 异常情况：无refreshToken
          if (
            userModel.refreshToken === '' ||
            userModel.refreshToken === null ||
            userModel.refreshToken === undefined
          ) {
            response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
              expires: new Date(0),
              httpOnly: true,
            });
            if (isExistWhiteList(request.url)) {
              this.kunlunLogger.warn('白名单路径，跳过验证: RefreshToken不存在');
              return true;
            }
            throw new UnauthorizedException('Token异常');
          }
          const newAccessToken = await this.azureService.getAccessTokenUsingRefreshTokenByRaw(userModel.refreshToken);
          // 异常情况：无法通过refreshToken获取新的accessToken
          if (!newAccessToken) {
            response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
              expires: new Date(0),
              httpOnly: true,
            });
            if (isExistWhiteList(request.url)) {
              this.kunlunLogger.warn('白名单路径，跳过验证: Azure AD 通过RefreshToken获取AccessToken失败');
              return true;
            }
            throw new UnauthorizedException('Azure AD 异常');
          }
          await this.userService.updateUserToken(userEmail, {
            accessToken: newAccessToken,
            refreshToken: userModel.refreshToken,
            lastLoginAt: new Date(),
          });
          request.user = {
            id: userModel._id.toString(),
            email: userModel.email,
            name: userModel.name,
            role: userModel.role,
            type: 'azure',
          } as RequestUserInfo;
          // 成功响应 - 续签
          response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, newAccessToken, {
            expires: new Date(Date.now() + AuthService.EXPIRED_DURATION),
            httpOnly: true,
          });
          this.kunlunLogger.warn('Azure AD 续签完成');
          return true;
        }
        if (_error.message === 'invalid signature') {
          this.kunlunLogger.error('Azure AD 凭证无效: ', _error);
          response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
            expires: new Date(0),
            httpOnly: true,
          });
          if (isExistWhiteList(request.url)) {
            this.kunlunLogger.log('白名单路径，跳过验证: Azure AD 凭证无效');
            return true;
          }
          throw new UnauthorizedException('Azure AD 凭证无效');
        }

        if (isExistWhiteList(request.url)) {
          this.kunlunLogger.log('白名单路径，跳过验证: 最终无授权信息');
          return true;
        }

        response.cookie(JWT_TOKEN_KEY_FOR_COOKIES, '', {
          expires: new Date(0),
          httpOnly: true,
        });
        this.kunlunLogger.error('Azure AD 凭证验证失败: ', _error);
        // 验证失败
        throw new UnauthorizedException(_error.message);
      }
    }
  }
}
