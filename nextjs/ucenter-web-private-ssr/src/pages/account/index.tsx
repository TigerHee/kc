import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { getTenantConfig } from '@/tenant';
// import { safeDynamic } from '@/tools/safeDynamic';
import { COMMON_GBIZ_TRANS_NS_LIST } from '@/config/base';
import PageRouterComponent from '@/routers/AccountPage/index';

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

// const PageRouterComponent = safeDynamic(() => import('@/routers/AccountPage/index'), {
//   ssr: false,
// });


const Page: PageWithActiveBrandKeys = () => {
  return <PageRouterComponent />;
};

const activeSiteConfig = () => {
  return ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(getTenantConfig().siteRoute);
};

export const getServerSideProps: GetServerSideProps = withCommonProps({
  activeSiteConfig,
  auth: true,
})(async (ctx: GetServerSidePropsContext, commonData) => {
  return {
    props: {
      ...commonData,
      ...(await serverSideTranslations(ctx.locale || 'en', COMMON_GBIZ_TRANS_NS_LIST)),
    },
  };
});

Page.activeSiteConfig = activeSiteConfig;

export default Page;
