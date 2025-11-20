import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Page from '@/routers/DemoPage';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { getTenantConfig } from '@/tenant';
import { COMMON_GBIZ_TRANS_NS_LIST } from '@/config/base';

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const HomePage: PageWithActiveBrandKeys = () => <Page />;

const activeSiteConfig = () => {
  return ['KC_ROUTE'].includes(getTenantConfig().siteRoute);
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

HomePage.activeSiteConfig = activeSiteConfig;

export default HomePage;
