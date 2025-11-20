import Decimal from 'decimal.js';

export const getRequestOriginInfo = req => {
  const getHeader = (key, fallback = '') => {
    const val = req.headers[key];
    if (!val) return fallback;
    return val.trim();
  };

  const protocol = getHeader('x-forwarded-proto', 'http');
  const host = getHeader('x-forwarded-host') || getHeader('host');
  const userAgent = getHeader('user-agent', '');
  const path = req.url || '';
  return {
    origin: `${protocol}://${host}`,
    proto: protocol,
    host,
    path,
    userAgent,
  };
};

/**
 * @decription 高精度加法
 */
export const add = (a, b) => {
  return new Decimal(a).plus(b);
};
