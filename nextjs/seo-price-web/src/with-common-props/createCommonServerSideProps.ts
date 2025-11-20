import { GetServerSidePropsContext } from "next";
import { getServerSideProps as getFooterServerSideProps } from "gbiz-next/Footer";
import { getCurrentLang, getHostname } from "kc-next/boot";
import { serverTdk } from "@kc/tdk";
import { IS_DEV } from "kc-next/env";
import { getRequestOriginInfo } from "@/tools/helper";
import { X_PLATFORM_HEADER } from "@/config/base";
import { getDefaultPlatform } from "@/tools/getPlatform";

const getTdk = (path: string, replaceData: any) => {
  path = path.startsWith('/price/page/') ? '/price' : path;

  return new Promise((resolve) => {
    try {
      serverTdk.init({
        host: IS_DEV
          ? new URL(process.env.NEXT_PUBLIC_API_URL!).hostname
          : getHostname(),
      });

      serverTdk
        .getTdkData({
          pathname: path,
          language: getCurrentLang(),
          replaceData,
        })
        .then((tdk) => {
          resolve(tdk || null);
        })
        .catch((e) => {
          resolve(null);
        });
    } catch (tdkError) {
      //todo:dev:spa 网络报错
      console.warn("serverTdk init/getTdkData failed:", tdkError);
      resolve(null);
    }
  });
};

export const createCommonServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const ua = ctx.req.headers["user-agent"];
  const xPlatForm = ctx.req.headers[X_PLATFORM_HEADER] || getDefaultPlatform(ua);
  const { path } = getRequestOriginInfo(ctx.req);
  const coin = ctx.params?.coin as string;

  let replaceData: null | any = null;

  if (typeof coin === 'string' && coin) {
    replaceData = {
      path: '/price/[coin]',
      data: [coin, coin],
    };
  }

  try {
    const [
      defaultTdk,
      footerStore,
    ] = await Promise.all([
      getTdk(path, replaceData),
      getFooterServerSideProps(),
    ]);

    return {
      _platform: xPlatForm,
      FooterStore: footerStore,
      defaultTdk,
    };
  } catch (e) {
    console.log("get commonServerSideProps failed:", e);
    return {
      _platform: xPlatForm,
      FooterStore: await getFooterServerSideProps(),
      defaultTdk: null,
    };
  }
};
