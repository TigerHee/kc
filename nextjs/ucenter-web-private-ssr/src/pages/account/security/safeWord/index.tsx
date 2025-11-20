/**
 * Owner: vijay.zhou@kupotech.com
 */
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { safeDynamic } from '@/tools/safeDynamic';
import { COMMON_GBIZ_TRANS_NS_LIST } from '@/config/base';
import 'src/tools/i18n/client.ts';
import { getTenantConfig } from '@/tenant';

const PageRouterComponent = safeDynamic(() => import(/* webpackChunkName: "r__account__security__safeWord__index" */ '@/routers/AccountPage/Security/SafeWord/index'), {
  ssr: false,
});

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const Page: PageWithActiveBrandKeys = () => {
  return <PageRouterComponent />;
};

const activeSiteConfig = () => {
  return ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(getTenantConfig().siteRoute);
};

export const getServerSideProps: GetServerSideProps = withCommonProps({
  activeSiteConfig,
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
