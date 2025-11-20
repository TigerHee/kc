/**
 * Owner: corki.bai@kupotech.com
 */

import { PREFIX } from '../../common/constants';

export const LAST_BROWSER_EXTENSION_LIST_KEY = `${PREFIX}_last_browser_extension_list`;

export const LAST_CLOSE_BROWSER_EXTENSION_NOTICE_TIME = `${PREFIX}_last_close_browser_extension_notice_time`;

export const EXPIRE_TIME = 30 * 60 * 1000; // 30分钟

// 需要支持坚持的浏览器
export const SUPPORT_BROWSER_EXTENSION = ['CHROME', 'EDGE', 'BRAVE'];

export const guideType = 'SAFE_REMIND_MESSAGE';

export const PLATFORM = 'KUCOIN_WEB';
