/**
 * Owner: willen@kupotech.com
 */
import { getDvaApp } from '@kucoin-base/dva';
import remoteTools from '@kucoin-biz/tools';
import Report from 'tools/ext/kc-report';

const { remoteEvent } = remoteTools;

remoteEvent.on(remoteEvent.evts.GET_REPORT, (sendReport) => {
  if (typeof sendReport === 'function') {
    sendReport(Report);
  }
});

remoteEvent.on(remoteEvent.evts.GET_SENSORS, (sendSensors) => {
  if (typeof sendSensors === 'function') {
    const sensors = require('tools/ext/kc-sensors').default;
    sendSensors(sensors);
  }
});

remoteEvent.on(remoteEvent.evts.GET_DVA, (sendDva) => {
  if (typeof sendDva === 'function') {
    sendDva(getDvaApp());
  }
});

remoteEvent.on(remoteEvent.evts.GET_SOCKET, (sendWS) => {
  if (typeof sendWS === 'function') {
    import('@kc/socket').then((ws) => {
      const socket = ws.getInstance();
      sendWS(socket, ws.Topic);
    });
  }
});

remoteEvent.on(remoteEvent.evts.GET_HOST, (sendHost) => {
  const HOST = require('utils/siteConfig').default;
  const config = require('config').default;
  const { v2ApiHosts } = config;

  const host = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    DOCS_HOST: HOST.DOCS_HOST, // 文档地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: v2ApiHosts.CMS, // kucoin主站API地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
    TRADING_BOT_HOST: HOST.TRADING_BOT_HOST, // 机器人
  };

  sendHost(host);
});
