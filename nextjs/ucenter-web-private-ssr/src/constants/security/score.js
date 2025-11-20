/**
 * Owner: vijay.zhou@kupotech.com
 */
import { _t } from 'src/tools/i18n';

export const LEVEL_ENUMS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const LEVEL_COPY_TEXT_ENUMS = {
  [LEVEL_ENUMS.HIGH]: {
    title: () => _t('securityGuard.highScore.title'),
    desc: () => _t('securityGuard.highScore.desc'),
  },
  [LEVEL_ENUMS.MEDIUM]: {
    title: () => _t('securityGuard.mediumScore.title'),
    desc: () => _t('securityGuard.mediumScore.desc'),
  },
  [LEVEL_ENUMS.LOW]: {
    title: () => _t('securityGuard.lowScore.title'),
    desc: () => _t('securityGuard.lowScore.desc'),
  },
};
