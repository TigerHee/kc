/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2024-03-11 14:12:04
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-10 19:26:53
 * @FilePath: /g-biz/externals/packages/share.js
 * @Description:
 *
 *
 */
import withI18nReady from '@hooks/withI18nReady';
import {
  ShareModal as OriShareModal,
  ShareModalV2 as OriShareModalV2,
  ShareModelCard as OriShareModalCard,
  ShareCarousel as OriShareCarousel,
} from '@packages/share';

export const ShareModal = withI18nReady(OriShareModal, 'share');
export const ShareModalV2 = withI18nReady(OriShareModalV2, 'share');
export const ShareModelCard = withI18nReady(OriShareModalCard, 'share');
export const ShareCarousel = withI18nReady(OriShareCarousel, 'share');
export { getShareBaseUrl, getShareUrl } from '@packages/share';

export { useShareV3 } from '@packages/share';
