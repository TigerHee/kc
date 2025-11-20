import { GetServerSidePropsContext } from 'next';
import { getRequestOriginInfo } from './helper';
import { getTdk } from './tdkTools';
import { getPlatform } from 'gbiz-next/platform';
import { getInitialTheme } from 'gbiz-next/theme';
import { getServerSideProps as getFooterServerSideProps } from 'gbiz-next/Footer';

export const createCommonServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { path } = getRequestOriginInfo(ctx.req);

  const { platform, isMobile, isApp } = getPlatform(ctx);
  const theme = getInitialTheme({ defaultTheme: 'dark', ctx });

  const commonProps = {
    theme,
    _platform: platform,
    isMobile,
    isApp,
  };

  try {
    const [defaultTdk, footerStore] = await Promise.all([getTdk(path), getFooterServerSideProps()]);

    return {
      defaultTdk,
      FooterStore: footerStore,
      ...commonProps,
    };
  } catch (e) {
    console.log('get commonServerSideProps failed:', e);
    return {
      defaultTdk: null,
      FooterStore: await getFooterServerSideProps(),
      ...commonProps,
    };
  }
};
