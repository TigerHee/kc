/**
 * Owner: iron@kupotech.com
 */
import { setPush } from '@packages/notice-center/src/pushRouter';
import { NoticeCenter as OriNoticeCenter } from '@packages/notice-center';
import withI18nReady from '@hooks/withI18nReady';

export const NoticeCenter = withI18nReady(OriNoticeCenter, 'notice-center');
export const pushTool = { setPush };
