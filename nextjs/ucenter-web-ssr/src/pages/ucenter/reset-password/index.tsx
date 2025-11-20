import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { getTenantConfig } from '@/tenant';
import ResetPasswordPage from '@/routers/ucenter/ResetPasswordPage';
import JsBridge from 'gbiz-next/bridge';
import { useRouter } from 'kc-next/compat/router';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const Page: PageWithActiveBrandKeys = () => {
  const router = useRouter();
  const gotoSignin = () => {
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: { name: 'exit' },
      });
    } else {
      router?.push('/ucenter/signin');
    }
  };
  return (
    <ErrorBoundary scene={SCENE_MAP.resetPassword.index}>
      <ResetPasswordPage onSuccess={gotoSignin} onBack={gotoSignin} />
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
