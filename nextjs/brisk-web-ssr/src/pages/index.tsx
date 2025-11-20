import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Page from '@/routers/HomePage';
import { withCommonProps } from '@/tools/withCommonServerProps';
import { bootConfig } from 'kc-next/boot';
import { createConfigStore } from '@/store/config';

type PageWithActiveBrandKeys = React.FC & {
  activeSiteConfig?: () => boolean;
};

const HomePage: PageWithActiveBrandKeys = () => <Page />;

const activeSiteConfig = () => {
  return bootConfig._SITE_CONFIG_.functions.home_page;
};

export const getServerSideProps: GetServerSideProps = withCommonProps({
  activeSiteConfig,
})(async (ctx: GetServerSidePropsContext, commonData) => {
  const configStore = createConfigStore();

  const [configItems] = await Promise.all([
    configStore.getState().pullConfigItems()
  ]);

  return {
    props: {
      ...commonData,
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'header', 'footer','siteRedirect', 'notice-center', 'userRestricted', 'trade' ])),
      // 传递预获取的数据
      ConfigStore: {
        configItems
      },
    },
  };
});

HomePage.activeSiteConfig = activeSiteConfig;

export default HomePage;
