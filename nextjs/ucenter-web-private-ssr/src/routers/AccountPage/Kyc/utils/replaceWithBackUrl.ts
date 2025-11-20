import { replace } from '@/utils/router';

const replaceWithBackUrl = (nextUrl: string, backUrl: string) => {
  replace(
    backUrl
      ? `${nextUrl}?backUrl=${encodeURIComponent(backUrl)}`
      : nextUrl
  );
};

export default replaceWithBackUrl;
