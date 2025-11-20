/**
 * Owner: vijay.zhou@kupotech.com
 */
const prefix = '[risk-validation] ';

const report = (params) => {
  const { SENTRY_NAMESPACE } = window || {};
  const sentryNamespace = SENTRY_NAMESPACE || 'SentryLazy';
  const sentryFunc = window[sentryNamespace];
  try {
    if (sentryFunc && sentryFunc.captureEvent) {
      sentryFunc.captureEvent({
        ...params,
        message: `${prefix}${params.message}`,
        fingerprint: `${prefix}${params.fingerprint}`,
      });
      console.log(params.message, params.fingerprint);
    }
  } catch (error) {
    console.error(error);
  }
};

/** 上报验证方式不支持 */
export const reportMethodNotSupported = ({ bizType, transactionId, methods, isRecommend }) => {
  report({
    message: `${bizType}: Method ${methods.join(', ')} not supported.`,
    // 推荐不支持会阻塞主流程，告警等级 up
    // 备选不支持会被过滤掉不阻塞主流程
    level: isRecommend ? 'error' : 'warning',
    tags: {
      errorType: 'risk_validation_method_not_supported',
      bizType, // 业务类型
      transactionId, // 操作 id
    },
    fingerprint: `${bizType}: ${
      isRecommend ? 'Recommended' : 'Alternative'
    } method is not supported`,
  });
};

export const reportAppBridgeError = ({ bizType, msg }) => {
  report({
    message: msg,
    level: 'error',
    tags: {
      errorType: 'risk_validation_native_error',
      bizType,
    },
    fingerprint: 'app bridge open error',
  });
};

export const reportAppBridgeResponseError = ({ bizType, noToken, noSession, noFingerprint }) => {
  report({
    message: 'app bridge response lacks parameters',
    level: 'warning',
    tags: {
      errorType: 'risk_validation_native_error',
      bizType,
      noToken,
      noSession,
      noFingerprint,
    },
    fingerprint: 'app bridge response error',
  });
};
