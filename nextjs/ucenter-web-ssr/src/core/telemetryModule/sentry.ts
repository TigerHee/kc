import { captureEvent, Event } from '@sentry/nextjs';

export function reportIntlMissing(key: string) {
  try {
    captureEvent({
      message: `i18n key missing: ${key}`,
      level: 'error',
      tags: {
        errorType: 'i18n_missing_key',
      },
      fingerprint: [key],
    });
  } catch (e) {
    console.log(e);
  }
}

export function sentryReport(opt: Event) {
  try {
    captureEvent(opt);
  } catch (e) {
    console.log(e);
  }
}

/** /restrict 路由 code 不匹配 */
export function reportRestrictMismatch(code) {
  try {
    captureEvent({
      message: `/restrict code mismatch: ${code}`,
      level: 'error',
      tags: { errorType: 'restrict_code' },
      fingerprint: ['restrict_code'],
    });
  } catch (e) {
    console.log(e);
  }
}

// 上报请求非200异常
export function reportNormalError(method: string, error: any) {
  try {
    captureEvent({
      message: `方法调用错误: ${method}`,
      level: 'error',
      tags: {
        method_name: method,
        requestError: 'statusError',
      },
      extra: {
        error,
      },
      fingerprint: [method],
    });
  } catch (e) {
    console.log(e);
  }
}
