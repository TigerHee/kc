import { GetServerSidePropsContext } from 'next';
import { getRequestOriginInfo } from './helper';
import { getTdk } from './tdkTools';
import getCookieTheme from './getCookieTheme';
import { getDefaultPlatform } from './getPlatform';
import { X_PLATFORM_HEADER } from '@/config/base';

export const createCommonServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const { path } = getRequestOriginInfo(ctx.req);
  const theme = getCookieTheme(ctx);

  const ua = ctx.req.headers['user-agent'];
  const xPlatForm = ctx.req.headers[X_PLATFORM_HEADER] || getDefaultPlatform(ua);

  try {
    const [defaultTdk] = await Promise.all([getTdk(path)]);

    return {
      defaultTdk,
      theme,
      _platform: xPlatForm,
    };
  } catch (e) {
    console.log('get commonServerSideProps failed:', e);
    return {
      defaultTdk: null,
      theme,
      _platform: xPlatForm
    };
  }
};
