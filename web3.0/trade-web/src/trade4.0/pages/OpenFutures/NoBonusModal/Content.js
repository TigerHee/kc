/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';

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
