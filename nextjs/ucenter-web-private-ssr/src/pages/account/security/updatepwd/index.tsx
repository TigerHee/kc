/**
 * Owner: vijay.zhou@kupotech.com
 */
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { safeDynamic } from '@/tools/safeDynamic';
import { getTenantConfig } from '@/tenant';
import { COMMON_GBIZ_TRANS_NS_LIST } from '@/config/base';
import 'src/tools/i18n/client.ts';

const PageRouterComponent = safeDynamic(() => import(/* webpackChunkName: "r__account__security__updatepwd__index" */ '@/routers/AccountPage/Security/Updatepwd'), {
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
