import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  Redirect,
} from "next";
import { createCommonServerSideProps } from "./createCommonServerSideProps";
import { IS_SSR_MODE, IS_CLIENT_ENV } from "kc-next/env";
import { getRequestOriginInfo } from "@/tools/helper";
import {
  initBootConfig,
  bootConfig,
  getIsApp,
  getOrigin,
  getCurrentLocale,
} from "kc-next/boot";
import { getTenantConfig } from "@/config/tenant";
import { addLangToPath } from "@/tools/i18n";

type CommonPropsConfig = {
  activeSiteConfig?: string[];
};

type CommonProps = {
  FooterStore: any;
  defaultTdk?: any;
};

type HandlerWithCommon<P> = (
  ctx: GetServerSidePropsContext,
  commonData: CommonProps
) => Promise<GetServerSidePropsResult<P>>;

function isRedirectOrNotFound<T>(
  result: GetServerSidePropsResult<T>
): result is { redirect: Redirect } | { notFound: true } {
  return "redirect" in result || "notFound" in result;
}

function checkIsEmptyObject(obj: any) {
  return Object.keys(obj ?? {}).length === 0;
}

function createCommonErrorResponse(
  error?: any,
  message?: string,
  code?: number
): any {
  return {
    error: error || "Internal Server Error",
    message: message || "Get Server Side Props Error",
    code: code || 500,
  };
}

export async function initBootConfigIfSSR(
  ctx: GetServerSidePropsContext,
  config?: CommonPropsConfig
): Promise<any> {
  const { req, locale } = ctx;
  const { host, origin, path, userAgent } = getRequestOriginInfo(req);

  const brandSite = process.env.NEXT_PUBLIC_BRAND_SITE || "KC";
  initBootConfig({
    brandSite,
    hostname: host,
    origin,
    locale,
    path,
    userAgent,
  });

  const siteRoute = getTenantConfig().siteRoute;

  // 不在白名单中的站点直接跳转 404
  if (
    siteRoute &&
    config?.activeSiteConfig &&
    !config.activeSiteConfig.includes(siteRoute)
  ) {
    return {
      redirect: {
        destination: `${getOrigin()}${addLangToPath("/404")}`,
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
      const commonProps = await getCommonProps(ctx, config);

      if (isRedirectOrNotFound(commonProps)) {
        return commonProps;
      }

      // TODO: price没有这些公共props，怎么降级
      // 检测 commonProps 部分业务逻辑对象是否为空，触发spa降级
      // if (
      //   !IS_CLIENT_ENV &&
      //   (checkIsEmptyObject(commonProps.LearnStore) ||
      //     checkIsEmptyObject(commonProps.HeaderStore))
      // ) {
      //   ctx.res.statusCode = 500;
      //   return {
      //     props: createCommonErrorResponse(),
      //   };
      // }

      if (!handler) {
        return { props: commonProps };
      }

      // 捕获业务getServerSideProps渲染错误降级spa
      try {
        const result = await handler(ctx, commonProps);

        if ("props" in result) {
          return {
            props: {
              ...commonProps,
              ...result.props,
            } as P,
          };
        }

        return result;
      } catch (error) {
        ctx.res.statusCode = 500;
        return {
          props: createCommonErrorResponse(),
        };
      }
    };
  };
}
