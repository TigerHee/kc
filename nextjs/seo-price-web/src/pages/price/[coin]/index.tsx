/**
 * Owner: will.wang@kupotech.com
 */
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CoinPage from "@/routes/[coin]";
import { getInitialCoinDetail } from "@/store/coinDetail";
import { GetServerSidePropsContext } from "next";
import { withCommonProps } from "@/with-common-props";
import { ALL_I18N_LOCALES } from "@/config/base";
import { getOrigin } from "kc-next/boot";
import { addLangToPath } from "@/tools/i18n";
import { IS_CLIENT_ENV, IS_SPA_MODE, IS_SSR_MODE } from "kc-next/env";

const CoinDetail = (props: { coin?: string; }) => {

  return (
    <CoinPage coin={props.coin!} />
  )
}

const activeSiteConfig = ["KC_ROUTE", "TH_ROUTE", "TR_ROUTE"];

export const getServerSideProps = withCommonProps<{ coin: string }>({ 
  activeSiteConfig
})(async (
  ctx: GetServerSidePropsContext
) => {
  const coin = ctx.params?.coin as string;

  const coinDetail = await getInitialCoinDetail(coin!, 'USD');

  // 如果dataSource为null，则视为一个无效的币
  if (!coinDetail.coinInfo?.dataSource) {
    const notFoundPath = `${getOrigin()}${addLangToPath('/404')}`;
    
    if (IS_SSR_MODE) {
      return {
        // 这里为什么用 redirect，确保重定向到 main-web 的 404
        redirect: {
          destination: notFoundPath,
          permanent: false,
        }
      }
    }
    
    if(IS_SPA_MODE && IS_CLIENT_ENV) {
      window.location.href = notFoundPath;
    }
  }

  return {
    props: {
      coin,
      coinDetail,
      ...(await serverSideTranslations(ctx.locale || "en", ALL_I18N_LOCALES)),
    }
  };
});


export default CoinDetail;