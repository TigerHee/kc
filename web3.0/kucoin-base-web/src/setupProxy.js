const { createProxyMiddleware } = require('http-proxy-middleware');
const { createWebpackMockMiddleware } = require('@kc/mk-plugin-mock')

const rewriteSetCookie = (cookie) => {
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

const onProxyRes = (proxyRes) => {
  const setCookie = proxyRes.headers['set-cookie'];
  proxyRes.headers['set-cookie'] = rewriteSetCookie(setCookie);
  proxyRes.headers['Access-Control-Allow-Origin'] = `https://localhost:8000`;
  proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
};

const siteArg = process.argv.find((arg) => arg.indexOf('site=') !== -1);
const site = siteArg ? siteArg.slice(5) : 'main';

const NGINX_ENV_ORIGIN =
  site === 'main'
    ? process.env.NGINX_ENV_ORIGIN
    : process.env[`NGINX_ENV_ORIGIN_${site.toUpperCase()}`] || process.env.NGINX_ENV_ORIGIN;

const onProxyReq = (proxyReq, req) => {
  Object.keys(req.header).forEach((key) => {
    proxyReq.setheader(key, req.header[key]);
  });
  proxyReq.setHeader('Origin', NGINX_ENV_ORIGIN);
  proxyReq.setHeader('Host', NGINX_ENV_ORIGIN.replace(/https?:\/\//, ''));
};

module.exports = function (app) {
  // 环境变量中所有以 REACT_MOCK_PATH 开头的变量都会被当作 mock 路径
  const MOCK_KEY_PATH_PREFIX = 'REACT_MOCK_PATH';
  const mockPaths = Object.keys(process.env)
    .filter((key) => key.startsWith(MOCK_KEY_PATH_PREFIX))
    .map((key) => process.env[key]);

  app.use(createWebpackMockMiddleware({
    mockPath: mockPaths.length ? mockPaths : 'mock',
    enable: process.env.REACT_ENABLE_MOCK === "true",
  }));

  app.use(
    '/set_theme',
    createProxyMiddleware({
      target: NGINX_ENV_ORIGIN,
      pathRewrite: {},
      changeOrigin: true,
      secure: false,
      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }),
  );
  app.use(
    '/_api',
    createProxyMiddleware({
      target: NGINX_ENV_ORIGIN,
      pathRewrite: {},
      changeOrigin: true,
      secure: false,
      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }),
  );
  app.use(
    '/swagger',

    createProxyMiddleware({
      target: 'http://10.236.3.189:10240/',

      pathRewrite: { '^/swagger': '/' },

      changeOrigin: true,

      secure: false,

      // 清除代理处理

      onProxyRes,
    }),
  );

  app.use(
    '/_api_kumex',

    createProxyMiddleware({
      target: NGINX_ENV_ORIGIN,

      pathRewrite: {},

      changeOrigin: true,

      secure: false,

      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }),
  );
  app.use(
    '/_api_robot',
    createProxyMiddleware({
      target: NGINX_ENV_ORIGIN,
      pathRewrite: {},
      changeOrigin: true,
      secure: false,
      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }),
  );

  app.use(
    '/_api_unified',

    createProxyMiddleware({
      target: NGINX_ENV_ORIGIN,

      pathRewrite: {},

      changeOrigin: true,

      secure: false,

      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }),
  );

  app.use(
    '/_markdown_/',

    createProxyMiddleware({
      target: NGINX_ENV_ORIGIN,

      pathRewrite: { '^/_markdown_': '/_cdn/futures/markdown' },

      changeOrigin: true,

      secure: false,

      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }),
  );
  app.use(
    '/_pxapi',
    createProxyMiddleware({
      target: NGINX_ENV_ORIGIN,
      pathRewrite: {},
      changeOrigin: true,
      secure: false,
      // 清除代理处理
      onProxyRes,
      onProxyReq,
    }),
  );

  app.use(
    createProxyMiddleware(
      function (path, req) {
        if (req.query.usessg) {
          return true;
        }
        return false;
      },
      {
        target: 'http://localhost:3001',
      },
    ),
  );
};
