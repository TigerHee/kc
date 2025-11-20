import { createCommonServerSideProps } from '@/tools/createCommonServerSideProps';
import { getGlobalTenantConfig } from 'gbiz-next/tenant';
import { runNextSSRStore } from 'gbiz-next/asyncLocalStorage';
import {
  bootConfig,
  getCurrentLocale,
  getIsApp,
  getOrigin,
  initBootConfig,
} from 'kc-next/boot';
import { IS_SSR_MODE } from 'kc-next/env';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  Redirect,
} from 'next';
import { getRequestOriginInfo } from './helper';
import { addLangToPath } from './i18n';

type CommonPropsConfig = {
  activeSiteConfig?: () => boolean;
};

type CommonProps = {
  defaultTdk?: any;
};

type HandlerWithCommon<P> = (
  ctx: GetServerSidePropsContext,
  commonData: CommonProps
) => Promise<GetServerSidePropsResult<P>>;

function isRedirectOrNotFound<T>(
  result: GetServerSidePropsResult<T>
): result is { redirect: Redirect } | { notFound: true } {
  return 'redirect' in result || 'notFound' in result;
}

function createCommonErrorResponse(
  error?: any,
  message?: string,
  code?: number
): any {
  return {
    error: error || 'Internal Server Error',
    message: message || 'Get Server Side Props Error',
    code: code || 500,
  };
}

export async function initBootConfigIfSSR(
  ctx: GetServerSidePropsContext,
  config?: CommonPropsConfig
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
    const targetPath = globalTenantConfig.disabledRouteToHome
      ? '/'
      : `/404?from=${path}`;
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
  skipCommonProps: boolean = false
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
    };
  }

  const commonData = await createCommonServerSideProps(ctx);

  return { ...commonData, isApp, _BOOT_CONFIG_: bootConfig };
}

// 兼容老用法
export function withCommonProps<P extends { [key: string]: any }>(
  config?: CommonPropsConfig
) {
  return function (handler?: HandlerWithCommon<P>): GetServerSideProps<P> {
    return async (
      ctx: GetServerSidePropsContext
    ): Promise<GetServerSidePropsResult<P>> => {
      return runNextSSRStore(ctx.req, async () => {
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
