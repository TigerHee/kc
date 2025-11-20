import { createCommonServerSideProps } from '@/tools/createCommonServerSideProps';
import { runNextSSRStore } from 'gbiz-next/asyncLocalStorage';
import { getGlobalTenantConfig } from 'gbiz-next/tenant';
import { bootConfig, getCurrentLocale, getIsApp, getOrigin, initBootConfig } from 'kc-next/boot';
import { IS_SSR_MODE } from 'kc-next/env';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  Redirect,
} from 'next';
import { initServerDvaApp } from './dva/getServerSideProps';
import { getRequestOriginInfo } from './helper';
import { addLangToPath } from './i18n';

type CommonPropsConfig = {
  activeSiteConfig?: () => boolean;
  auth?: boolean;
  noCache?: boolean;
};

type CommonProps = {
  defaultTdk?: any;
  initialDvaState: Record<string, any>;
};

type HandlerWithCommon<P> = (
  ctx: GetServerSidePropsContext,
  commonData: CommonProps,
) => Promise<GetServerSidePropsResult<P>>;

function isRedirectOrNotFound<T>(
  result: GetServerSidePropsResult<T>,
): result is { redirect: Redirect } | { notFound: true } {
  return 'redirect' in result || 'notFound' in result;
}

function createCommonErrorResponse(error?: any, message?: string, code?: number): any {
  return {
    error: error || 'Internal Server Error',
    message: message || 'Get Server Side Props Error',
    code: code || 500,
  };
}

export function setNoCacheHeaders(res: GetServerSidePropsContext['res']) {
  res.setHeader('Cache-Control', 'no-store, no-cache, private, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Cache-Bypass', 'true');
  console.log('No-Cache headers set');
}

export async function initBootConfigIfSSR(
  ctx: GetServerSidePropsContext,
  config?: CommonPropsConfig,
): Promise<any> {
  const { req, locale } = ctx;
  const { host, origin, path, userAgent } = getRequestOriginInfo(req);
  const brandSite = process.env.NEXT_PUBLIC_BRAND_SITE || 'KC';

  const globalTenantConfig = getGlobalTenantConfig();

  initBootConfig({
    brandSite,
    hostname: host,
    origin,
    locale,
    path,
    userAgent,
  });

  // 不在白名单中的站点直接跳转 404
  if (config?.activeSiteConfig && !config.activeSiteConfig()) {
    const targetPath = globalTenantConfig.disabledRouteToHome ? '/' : `/404?from=${path}`;
    return {
      redirect: {
        destination: `${getOrigin()}${addLangToPath(targetPath)}`,
        permanent: false,
      },
    };
  }
  const currentLocale = getCurrentLocale();
  // 同步 bootConfig locale 到 ctx
  if (currentLocale) {
    ctx.locale = currentLocale;
  }
}

export async function getCommonProps(
  ctx: GetServerSidePropsContext,
  config?: CommonPropsConfig,
  skipCommonProps: boolean = false,
) {
  // bootConfig 初始化和权限校验
  if (IS_SSR_MODE) {
    const redirect = await initBootConfigIfSSR(ctx, config);
    if (redirect) return redirect;
  }
  const isApp = getIsApp() ?? false;

  if (skipCommonProps) {
    return {
      isApp,
      initialDvaState: {},
    };
  }

  const commonData = await createCommonServerSideProps(ctx);

  const serverDvaApp = (ctx as any).serverDvaApp;
  const initialDvaState = IS_SSR_MODE ? serverDvaApp._store.getState() : {};

  return { ...commonData, isApp, _BOOT_CONFIG_: bootConfig, initialDvaState };
}

// 兼容老用法
export function withCommonProps<P extends { [key: string]: any }>(config?: CommonPropsConfig) {
  return function (handler?: HandlerWithCommon<P>): GetServerSideProps<P> {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
      return runNextSSRStore(ctx.req, async () => {
        if (IS_SSR_MODE) {
          // 每个请求单独 init dva 实例，且需要独立存储，防止多个请求之间串数据
          const serverDvaApp = initServerDvaApp();
          (ctx as any).serverDvaApp = serverDvaApp;
          if (config?.auth) {
            // 登录校验
            const isLogin = await serverDvaApp._store.dispatch({
              type: 'user/pullUserServer',
            });
            const { origin, path } = getRequestOriginInfo(ctx.req);
            const loginUrl =
              `${ctx.locale === 'default' ? '' : '/' + ctx.locale}/ucenter/signin?backUrl=` +
              encodeURIComponent(`${origin}${path}`);

            // 设置防缓存
            setNoCacheHeaders(ctx.res);

            // 未登录重定向
            if (!isLogin) {
              return {
                redirect: {
                  destination: loginUrl,
                  permanent: false,
                },
              } as GetServerSidePropsResult<any>;
            }
            // console.log('[DVA] User info injected into store during SSR', serverDvaApp._store.getState().user);
          }

          if (config?.noCache) {
            // 设置防缓存
            setNoCacheHeaders(ctx.res);
          }
        }

        const commonProps = await getCommonProps(ctx, config);

        if (isRedirectOrNotFound(commonProps)) {
          return commonProps;
        }

        if (!handler) {
          return { props: commonProps };
        }

        // 捕获业务getServerSideProps渲染错误降级spa
        try {
          const result = await handler(ctx, commonProps);

          if ('props' in result) {
            return {
              props: {
                ...commonProps,
                ...result.props,
              } as P,
            };
          }

          return result;
        } catch (error) {
          console.error('GetServerSideProps Error:', error);
          ctx.res.statusCode = 500;
          return {
            props: createCommonErrorResponse(),
          };
        }
      });
    };
  };
}
