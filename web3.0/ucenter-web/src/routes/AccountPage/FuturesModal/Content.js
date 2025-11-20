/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';

const Content = ({ isBonus }) => {
  return React.useMemo(() => {
    let type = _t('open.futures.tips.default');
    if (isBonus) {
      type = _t('open.futures.tips.bonus');
    }
    return type;
  }, [isBonus]);
};

export default Content;
