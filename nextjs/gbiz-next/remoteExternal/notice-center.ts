import { setPush } from 'packages/notice-center/pushRouter';
import OriNoticeCenter from 'packages/notice-center';
import withI18nReady from 'adaptor/tools/withI18nReady';

export const NoticeCenter = withI18nReady(OriNoticeCenter, 'notice-center');
export const pushTool = { setPush };
