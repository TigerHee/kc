/**
 * Owner: garuda@kupotech.com
 */
import { _t } from '../../builtinCommon';
import { ADVANCED_FOK, ADVANCED_IOC, ADVANCED_POST_ONLY } from '../../config';

// 高级类型的下拉选项
export const ADVANCED_TYPES = [
  {
    label: _t('fvjea5ZHHAM5xQBfJx8rGf'),
    value: ADVANCED_POST_ONLY,
  },
  {
    label: _t('cy6bX7fNPPnZiqPuUX1nA1'),
    value: ADVANCED_FOK,
  },
  {
    label: _t('aRtmExjzQz6apcXiE2WBe5'),
    value: ADVANCED_IOC,
  },
];

export const ADVANCED_TOOLTIP = {
  [ADVANCED_POST_ONLY]: _t('tRKyMVY9vELEiTNF825Fp9'),
  [ADVANCED_FOK]: _t('8mxHhSoj5ZE5RnAqKbjgFd'),
  [ADVANCED_IOC]: _t('bxdS61Gp8jT9u6tQWDqzon'),
};
