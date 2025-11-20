/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { withCommonProps } from '@/tools/withCommonServerProps';
import RestrictPage from '@/routers/RestrictPage';

type PageWithActiveBrandKeys = React.FC<{ query?: Record<string, string> }> & {
  activeSiteConfig?: () => boolean;
};

const Page: PageWithActiveBrandKeys = ({ query }) => <RestrictPage query={query} />;

const activeSiteConfig = () => {
  return true;
};

export const getServerSideProps: GetServerSideProps = withCommonProps({
  activeSiteConfig,
})(async (ctx: GetServerSidePropsContext, commonData) => {
  return {
    props: {
      ...commonData,
      ...(await serverSideTranslations(ctx.locale || 'en', [
        'common',
        'siteRedirect',
        'userRestricted',
      ])),
      query: ctx.query || {},
    },
  };
});

Page.activeSiteConfig = activeSiteConfig;

export default Page;
