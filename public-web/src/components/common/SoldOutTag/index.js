/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { _t } from 'tools/i18n';

import style from './style.less';

const SoldOutTag = () => {
  useLocale();
  return <span className={style.soldOutTag}>{_t('delisted')}</span>;
};

export default SoldOutTag;
