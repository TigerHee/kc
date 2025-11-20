import { samplingConfig, defaultSamplingConfig, debugSamplingConfig, NAMESPACE } from './config';

function initSentry(options = {}) {
  const { projectName, ...restProps } = options;
  // delete restProps.sampleRate;
  // delete restProps.tracesSampleRate;
  delete restProps.beforeSend;

  let rateConfig;

  if (restProps.debug) {
    rateConfig = debugSamplingConfig;
  } else {
    rateConfig = samplingConfig[projectName] || defaultSamplingConfig;
  }

  // 以用户本地设置为准，如果没有设置则使用统一设置的
  const sampleRate = restProps.sampleRate || rateConfig.sampleRate;
  const tracesSampleRate = restProps.tracesSampleRate || rateConfig.tracesSampleRate;

  delete restProps.sampleRate;
  delete restProps.tracesSampleRate;

  function beforeSend(event, hint) {
    let _sampleRate = sampleRate;
    if (event && event.level === 'fatal') {
      _sampleRate = 1;
    }
    const error = hint.originalException;
    if (error && error.code && (error.code === '401' || error.code >= '600')) {
      return null;
    }
    const random = Math.random();
    if (random <= _sampleRate) {
      return event;
    }
    return null;
  }

  if (window.SENTRY_SDK_SOURCE === 'loader') {
    // 通过 natasha-material-shared sentry/7.52.1/sentry-loader.js 加载 SDK
    const baseOptions = {
      beforeSend,
      integrations: [new window[NAMESPACE].BrowserTracing()],
    };

    window[NAMESPACE].init({
      ...restProps,
      ...baseOptions,
      tracesSampleRate,
    });
  }
}

export default initSentry;
