import { replace } from 'utils/router';

const replaceWithBackUrl = (nextUrl, backUrl) => {
  replace(backUrl ? `${nextUrl}?backUrl=${encodeURIComponent(backUrl)}` : nextUrl);
};

export default replaceWithBackUrl;
