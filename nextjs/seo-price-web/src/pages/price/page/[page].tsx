/**
 * Owner: will.wang@kupotech.com
 */
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PriceIndex from "@/routes/price"
import { getInitialPriceStoreState } from "@/store/price"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { withCommonProps } from "@/with-common-props";
import { ALL_I18N_LOCALES } from "@/config/base";

const PricePaginationPage = () => {

  return (
    <PriceIndex />
  );
} 

const activeSiteConfig = ["KC_ROUTE", "TH_ROUTE", "TR_ROUTE"];

export const getServerSideProps: GetServerSideProps = withCommonProps({ activeSiteConfig })(async (ctx: GetServerSidePropsContext, commonData) => {
  const { page = '1' } = ctx.params || {};
  const priceInitialState = await getInitialPriceStoreState({ page: String(page) });

  return {
    props: {
      PriceStore: priceInitialState,
      ...(await serverSideTranslations(ctx.locale || "en", ALL_I18N_LOCALES)),
    }
  }
})

export default PricePaginationPage;
