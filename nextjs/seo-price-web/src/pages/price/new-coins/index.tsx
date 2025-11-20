/**
 * Owner: will.wang@kupotech.com
*/
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getOtherCategoryInitialStoreState } from "@/store/price";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import OtherCategoryPanel from "@/routes/price/components/OtherCategoryPanel";
import IndexPageLayout from "@/routes/price/IndexPageLayout";
import { withCommonProps } from "@/with-common-props";
import { ALL_I18N_LOCALES } from "@/config/base";

const hotlist_payload = { keyName: 'newCoins', algorithm: 'NEW_CURRENCY' };

const NewCoins = () => {

  return (
    <IndexPageLayout>
      <OtherCategoryPanel payload={hotlist_payload} />
    </IndexPageLayout>
  )
};

const activeSiteConfig = ["KC_ROUTE", "TH_ROUTE", "TR_ROUTE"];

export const getServerSideProps: GetServerSideProps = withCommonProps({ activeSiteConfig })(async (ctx: GetServerSidePropsContext) => {
  const priceInitialState = await getOtherCategoryInitialStoreState(hotlist_payload);

  
  return {
    props: {
      PriceStore: priceInitialState,
      ...(await serverSideTranslations(ctx.locale || "en", ALL_I18N_LOCALES)),
    }
  }
})

export default NewCoins;
