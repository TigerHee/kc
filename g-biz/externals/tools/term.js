import addLangToPath from '@tools/addLangToPath';
import { siteConfig } from '@utils/env';
import storage from '@utils/storage';

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
  if (termConfig && !termId) {
    const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
    try {
      if (window[sentryNamespace]) {
        window[sentryNamespace]?.captureEvent({
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
  addLangToPath(`${siteConfig?.KUCOIN_HOST}/support/${termId}`, storage.getItem('kucoinv2_lang'));
