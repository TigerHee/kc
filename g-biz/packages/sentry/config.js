const bizType = {
  platform: '01', // 平台
  assets: '02', // 资产
  spot: '03', // 03 现货
  contract: '04', // 合约
  financial: '05', // 理财
  robot: '06', // 机器人
  pool: '07', // 矿池
  payment: '08', // 支付
};

const samplingConfig = {
  'bot-h5': {
    sampleRate: 0.01,
    tracesSampleRate: 0.01,
  },
  'bot-professional-web': {
    sampleRate: 0.01,
    tracesSampleRate: 0.01,
  },
  'fast-coin-web': {
    sampleRate: 0.01,
    tracesSampleRate: 0.01,
  },
  'futures-web-10': {
    sampleRate: 0.001,
    tracesSampleRate: 0.001,
  },
  'hybrid-h5': {
    sampleRate: 0.001,
    tracesSampleRate: 0.001,
  },
  'kucoin-main-web': {
    sampleRate: 0.001,
    tracesSampleRate: 0.001,
  },
  'landing-web': {
    sampleRate: 0.01,
    tracesSampleRate: 0.01,
  },
  'mining-pool': {
    sampleRate: 0.01,
    tracesSampleRate: 0.01,
  },
  'mining-pool-cloud': {
    sampleRate: 0.01,
    tracesSampleRate: 0.01,
  },
  'poolx-web': {
    sampleRate: 0.01,
    tracesSampleRate: 0.01,
  },
  'public-web': {
    sampleRate: 0.001,
    tracesSampleRate: 0.001,
  },
  'trade-web': {
    sampleRate: 0.001,
    tracesSampleRate: 0.001,
  },
};

const defaultSamplingConfig = {
  sampleRate: 0.001,
  tracesSampleRate: 0.001,
};

const debugSamplingConfig = {
  sampleRate: 1,
  tracesSampleRate: 1,
};

export const NAMESPACE = window.SENTRY_NAMESPACE || 'SentryLazy';

export default bizType;

export { samplingConfig, defaultSamplingConfig, debugSamplingConfig };
