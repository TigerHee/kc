/**
 * Owner: tiger@kupotech.com
 */
import appleIconDark from 'static/account/overview/external/apple-dark.svg';
import appleIcon from 'static/account/overview/external/apple.svg';
import googleIcon from 'static/account/overview/external/google.svg';
import telegramIcon from 'static/account/overview/external/telegram.svg';
import { _t } from 'tools/i18n';

export const renderConfig = {
  TELEGRAM: {
    icon: telegramIcon,
    label: _t('rytY7D8mH3Bm7vYg9qwx45'),
  },
  GOOGLE: {
    icon: googleIcon,
    label: _t('oYvYDY5sbZPvtwtcQP1yoj'),
  },
  APPLE: {
    icon: appleIcon,
    darkIcon: appleIconDark,
    label: _t('5ZTxQ32aNDJ4s2weYKBQGD'),
  },
};

export const bizType = 'EXTERNAL_BINDING';

export const defaultExternalList = [
  {
    extPlatform: 'TELEGRAM',
  },
  {
    extPlatform: 'GOOGLE',
  },
  {
    extPlatform: 'APPLE',
  },
];
