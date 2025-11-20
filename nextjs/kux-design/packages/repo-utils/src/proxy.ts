let NGINX_ENV_ORIGIN = ''

const rewriteSetCookie = (cookie: any) => {
  if (cookie && Array.isArray(cookie)) {
    const sessionIndex = cookie.findIndex((c) => {
      return c.includes('SESSION=');
    });

    if (sessionIndex !== -1) {
      cookie[sessionIndex] = cookie[sessionIndex].replace(/SameSite=None([^;]*);/gi, '');
      cookie[sessionIndex] = cookie[sessionIndex].replace(/SameSite=None$/i, '');
      cookie[sessionIndex] = cookie[sessionIndex].replace(/secure([^;]*);/gi, '');
      cookie[sessionIndex] = cookie[sessionIndex].replace(/secure$/i, '');
      cookie[sessionIndex] = cookie[sessionIndex].replace(/domain=([^;]+);/i, 'Domain=localhost;');
    }
  }
  return cookie;
};

let refererOrigin = '';

const onProxyRes = (proxyRes: any) => {
  console.log('refererOrigin', refererOrigin);
  const setCookie = proxyRes.headers['set-cookie'];
  proxyRes.headers['set-cookie'] = rewriteSetCookie(setCookie);
  proxyRes.headers['Access-Control-Allow-Origin'] = refererOrigin;
  proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
};

const onProxyReq = (proxyReq: any, req: any) => {
  Object.keys(req.header).forEach((key) => {
    proxyReq.setheader(key, req.header[key]);
  });
  refererOrigin = getOrigin(proxyReq.getHeader('Referer'));
  proxyReq.setHeader('Origin', NGINX_ENV_ORIGIN);
  proxyReq.setHeader('Host', NGINX_ENV_ORIGIN.replace(/https?:\/\//, ''));
};

function getOrigin(u: string) {
  try {
    const url = new URL(u);
    return url.origin;
  } catch (error) {
    return 'http://localhost:4321';
  }
}

export function configProxy(origin: string) {
  NGINX_ENV_ORIGIN = origin;
  return {
    '/_api': {
      target: origin,
      pathRewrite: {},
      changeOrigin: true,
      secure: false,
      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }
  }
}
