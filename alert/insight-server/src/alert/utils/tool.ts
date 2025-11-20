import { v4 as uuidv4 } from 'uuid';

// obj 转 query
export function toQueryParams(
  obj: Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined>,
): string {
  return Object.entries(obj)
    .flatMap(([key, val]) => {
      if (val === undefined || val === null) {
        return [];
      }

      if (Array.isArray(val)) {
        return val.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      }

      return [`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`];
    })
    .join('&');
}

const SENTRY_FLAG = 'https://sentry';
export const getHashContent = (item) => {
  const { teamsHrefData, message, _id, alertStrategy } = item;

  if (teamsHrefData?.some((i) => i.url.includes(SENTRY_FLAG))) {
    return teamsHrefData?.find((i) => i.url.includes(SENTRY_FLAG))?.url;
  }

  if (message?.includes('cypress')) {
    return message || _id;
  }

  return alertStrategy?.name || message || _id;
};

export const getUid = () => {
  return uuidv4().replace(/-/g, '');
};
