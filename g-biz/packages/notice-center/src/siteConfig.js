/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';

const globalHost = window._WEB_RELATION_ || {};

export default () => {
  // 兼容未通过 remoteEvent 传递 host 配置的项目，从全局变量取值
  let host = globalHost
    ? {
        KUCOIN_HOST: globalHost.KUCOIN_HOST,
        TRADE_HOST: globalHost.TRADE_HOST,
        DOCS_HOST: globalHost.DOCS_HOST,
        KUMEX_HOST: globalHost.KUMEX_HOST,
        SANDBOX_HOST: globalHost.SANDBOX_HOST,
        POOLX_HOST: globalHost.POOLX_HOST,
        LANDING_HOST: globalHost.LANDING_HOST,
        TRADING_BOT_HOST: globalHost.TRADING_BOT_HOST,
      }
    : Object.create(null);

  remoteEvent.emit(remoteEvent.evts.GET_HOST, (_host) => {
    host = _host;
  });

  return host;
};
