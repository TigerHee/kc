/**
 * Owner: garuda@kupotech.com
 */
import { MARGIN_MODE_CROSS, MARGIN_MODE_ISOLATED } from '@/meta/futures';
import { _t } from '@/pages/Futures/import';

export const SELECT_OPTIONS = [
  {
    value: MARGIN_MODE_CROSS,
    label: () => _t('futures.cross'),
  },
  {
    value: MARGIN_MODE_ISOLATED,
    label: () => _t('futures.isolated'),
  },
];

export const MARGIN_MODE_LABEL = {
  [MARGIN_MODE_CROSS]: _t('futures.cross'),
  [MARGIN_MODE_ISOLATED]: _t('futures.isolated'),
};
