import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { getTenantConfig } from '@/tenant';
import { safeDynamic } from '@/tools/safeDynamic';

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const PageRouterComponent = safeDynamic(() => import(/* webpackChunkName: "r__oauth__index" */ '@/routers/OauthPage/index'), {
  ssr: false,
});


const Page: PageWithActiveBrandKeys = () => {
  return <PageRouterComponent />;
};

const activeSiteConfig = () => {
  return ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(getTenantConfig().siteRoute);
};

export const getServerSideProps: GetServerSideProps = withCommonProps({
  activeSiteConfig,
})(async (ctx: GetServerSidePropsContext, commonData) => {
  return {
    props: {
      ...commonData,
      ...(await serverSideTranslations(ctx.locale || 'en', [
        'common',
        'header',
        'footer',
        'siteRedirect',
        'notice-center',
        'userRestricted',
      ])),
    },
  };
});

Page.activeSiteConfig = activeSiteConfig;

export default Page;
