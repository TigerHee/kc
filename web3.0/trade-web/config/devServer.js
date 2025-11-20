/**
 * Owner: garuda@kupotech.com
 * 定义devServer
 */

module.exports = {
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  },
  compress: true,
  hot: true,
  webSocketServer: 'ws',
  devMiddleware: {
    publicPath: '/',
  },
  historyApiFallback: true,
  static: {
    watch: {
      ignored: /(\.git|node_modules)/,
    },
  },
  client: {
    overlay: {
      runtimeErrors: (error) => {
        if (
          error &&
          [
            // 忽略 ResizeObserver loop相关报错
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications.',
            // 过滤正常 error 报错，不全局覆盖展示
            '[object Object]',
            // 过滤网络请求错误
            'Network Error',
            'Request failed with status code',
          ].some(v => error.message.indexOf(v) > -1)
        ) {
          return false;
        }
        return true;
      },
    },
    logging: 'info',
  },
};
