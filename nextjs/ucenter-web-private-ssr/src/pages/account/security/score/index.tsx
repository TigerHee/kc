/**
 * Owner: vijay.zhou@kupotech.com
 */
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { COMMON_GBIZ_TRANS_NS_LIST } from '@/config/base';
import { bootConfig } from 'kc-next/boot';
import 'src/tools/i18n/client.ts';
import PageRouterComponent from '@/routers/AccountPage/Security/Score/index';

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const Page: PageWithActiveBrandKeys = () => {
  return <PageRouterComponent />;
};

const activeSiteConfig = () => {
  return bootConfig._SITE_CONFIG_.functions.security_guard;
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
