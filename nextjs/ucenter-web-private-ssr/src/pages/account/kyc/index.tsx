/**
 * Owner: vijay.zhou@kupotech.com
 */
import { COMMON_GBIZ_TRANS_NS_LIST } from '@/config/base';
import PageRouterComponent from '@/routers/AccountPage/Kyc/index';
import { getTenantConfig } from '@/tenant';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
// import kycModel from '@/__models/account/kyc';
// import { IS_SERVER_ENV } from 'kc-next/env';

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
  auth: true,
})(async (ctx: GetServerSidePropsContext, commonData) => {
  // let initialDvaState = commonData.initialDvaState;

  // if (IS_SERVER_ENV) {
  //   const serverDvaApp = (ctx as any).serverDvaApp;
  //   serverDvaApp.model(kycModel);

  //   await serverDvaApp._store.dispatch({
  //     type: 'kyc/pullKycInfo',
  //   });

  //   initialDvaState = serverDvaApp._store.getState();
  // }

  return {
    props: {
      ...commonData,
      ...(await serverSideTranslations(ctx.locale || 'en', COMMON_GBIZ_TRANS_NS_LIST)),
      // initialDvaState,
    },
  };
});

Page.activeSiteConfig = activeSiteConfig;

export default Page;
