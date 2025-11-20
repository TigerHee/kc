import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import { HttpsProxyAgent } from 'https-proxy-agent';
import axios from 'axios';
import { ConfidentialClientApplication, IConfidentialClientApplication } from '@azure/msal-node';
import { KunlunLogger } from 'src/common/kunlun.logger';

@Injectable()
export class AzureService {
  logger = new KunlunLogger(AzureService.name);
  private jwksClient: jwksRsa.JwksClient;
  msalClient: IConfidentialClientApplication;
  scopes: string[] = [];

  constructor(private readonly configService: ConfigService) {
    this.scopes = ['offline_access', this.configService.get('AZURE_CLIENT_ID') + '/.default'];

    this.jwksClient = jwksRsa({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: `https://login.microsoftonline.com/${this.configService.get<string>('AZURE_TANANT_ID')}/discovery/v2.0/keys`,
      requestAgent:
        process.env.NODE_ENV === 'development'
          ? undefined
          : new HttpsProxyAgent(this.configService.get<string>('MWG_URL')),
    });

    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: configService.get<string>('AZURE_CLIENT_ID'),
        authority: configService.get<string>('AZURE_AUTHORITY'),
        clientSecret: configService.get<string>('AZURE_CLIENT_SECRET'),
      },
      system: {
        customAgentOptions:
          this.configService.get<string>('NODE_ENV') === 'development'
            ? undefined
            : new HttpsProxyAgent(configService.get<string>('MWG_URL')),
      },
    });
  }

  /**
   * 验证token
   * @param token
   * @returns
   */
  async verifyToken(token: string): Promise<any> {
    const decodedHeader: any = jwt.decode(token, { complete: true });
    if (!decodedHeader) {
      throw new UnauthorizedException('Invalid token');
    }

    const kid = decodedHeader.header.kid;
    const signingKey = await this.getSigningKey(kid);
    return jwt.verify(token, signingKey.getPublicKey(), { algorithms: ['RS256'] });
  }

  /**
   * 获取签名key
   * @param kid
   * @returns
   */
  private getSigningKey(kid: string): Promise<jwksRsa.SigningKey> {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(kid, (err, key) => {
        if (err) {
          return reject(err);
        }
        resolve(key);
      });
    });
  }

  /**
   * 获取授权链接
   * @param redirect 前端重定向的path
   * @returns
   */
  async getAuthUrl(redirect: string): Promise<string> {
    try {
      // 获取应用内的重定向地址
      const config = {
        scopes: this.scopes,
        redirectUri: this.configService.get<string>('AZURE_REDIRECT_URI'),
        state: encodeURIComponent(redirect),
      };
      const authUrl = await this.msalClient.getAuthCodeUrl(config);
      return authUrl;
    } catch (error) {
      this.logger.error('获取授权链接失败', error);
      throw new UnauthorizedException('获取授权链接失败');
    }
  }

  /**
   * 通过RawCode获取Token(原生方式)
   * @param code
   */
  async getTokenByRaw(code: string) {
    try {
      const response: {
        data: {
          access_token: string;
          refresh_token: string;
          token_type: string;
        };
      } = await axios.post(
        this.configService.get<string>('AZURE_AUTHORITY') + '/oauth2/v2.0/token',
        {
          client_id: this.configService.get<string>('AZURE_CLIENT_ID'),
          scope: this.scopes.join(' '),
          code: code,
          redirect_uri: this.configService.get<string>('AZURE_REDIRECT_URI'),
          grant_type: 'authorization_code',
          client_secret: this.configService.get<string>('AZURE_CLIENT_SECRET'),
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          httpsAgent:
            this.configService.get<string>('NODE_ENV') === 'development'
              ? undefined
              : new HttpsProxyAgent(this.configService.get<string>('MWG_URL')),
        },
      );
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (error) {
      // 失败大概率为 Azure AD 密钥过期或者是配置问题
      this.logger.error('Azure AD 接口请求失败', error);
      throw new UnauthorizedException('AzureAD接口请求失败');
    }
  }

  /**
   * 通过RefreshToken获取Token(原生方式)
   * @param refreshToken
   * @returns
   */
  async getAccessTokenUsingRefreshTokenByRaw(refreshToken: string): Promise<string> {
    try {
      const response: {
        data: {
          access_token: string;
          refresh_token: string;
          token_type: string;
        };
      } = await axios.post(
        this.configService.get<string>('AZURE_AUTHORITY') + '/oauth2/v2.0/token',
        {
          client_id: this.configService.get<string>('AZURE_CLIENT_ID'),
          scope: this.scopes.join(' '),
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
          client_secret: this.configService.get<string>('AZURE_CLIENT_SECRET'),
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          httpsAgent:
            this.configService.get<string>('NODE_ENV') === 'development'
              ? undefined
              : new HttpsProxyAgent(this.configService.get<string>('MWG_URL')),
        },
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Azure AD 接口请求失败', error);
      throw new UnauthorizedException('AzureAD接口请求失败');
    }
  }
}
