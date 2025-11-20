/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';

import style from './style.less';

const FiatTag = () => {
  return <span className={style.fiatTag}>{_t('fiat.account.sign')}</span>;
};

export default FiatTag;
