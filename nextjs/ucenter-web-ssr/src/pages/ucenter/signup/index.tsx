import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { getTenantConfig } from '@/tenant';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';
import { SignupPage } from '@/routers/ucenter/SignupPage';

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const Page: PageWithActiveBrandKeys = () => {
  return (
    <ErrorBoundary scene={SCENE_MAP.signup.index}>
      <SignupPage />
    </ErrorBoundary>
  );
};

const activeSiteConfig = () => {
  return ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(
    getTenantConfig().siteRoute
  );
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
        'entrance',
      ])),
    },
  };
});

Page.activeSiteConfig = activeSiteConfig;

export default Page;
