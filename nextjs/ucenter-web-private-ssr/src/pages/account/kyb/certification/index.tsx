/**
 * Owner: vijay.zhou@kupotech.com
 */
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { getTenantConfig } from '@/tenant';
import { safeDynamic } from '@/tools/safeDynamic';
import { COMMON_GBIZ_TRANS_NS_LIST } from '@/config/base';

const PageRouterComponent = safeDynamic(() => import(/* webpackChunkName: "r__account__kyb__certification__index" */ '@/routers/AccountPage/Kyc/Kyb/Certification'), {
  ssr: false,
});

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const Page: PageWithActiveBrandKeys = () => {
  return <PageRouterComponent />;
};

const activeSiteConfig = () => {
  const tenantConfig = getTenantConfig();
  return tenantConfig.kyc.upgrade && ['KC_ROUTE'].includes(tenantConfig.siteRoute);
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
