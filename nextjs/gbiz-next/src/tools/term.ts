import addLangToPath from 'tools/addLangToPath';
import { getSiteConfig } from 'kc-next/boot';
import { IS_CLIENT_ENV } from 'kc-next/env';

// 获取协议 id
export const getTermId = (termCode, termConfig) => {
  let termId = '';
  const userTermConfig = termConfig?.userTermConfig || [];
  userTermConfig.some((item) => {
    if (item.termCode === termCode) {
      termId = item.termId;
      return true;
    }
    return false;
  });

  // termConfig 存在，如果没有匹配的协议 id, 需要告警
  if (termConfig && !termId && IS_CLIENT_ENV) {
    const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
    try {
      if (window[sentryNamespace]) {
        (window[sentryNamespace] as any)?.captureEvent({
          level: 'error',
          message: `get termId empty from termCode: ${termCode}`,
          tags: {
            errorType: 'agreement_term_id_empty',
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  return termId;
};
// 通过协议 id 生成协议链接
export const getTermUrl = (termId) =>
  addLangToPath(`${getSiteConfig()?.KUCOIN_HOST}/support/${termId}`);
