/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import FormCheckBoxItem from './AdvancedCheckBoxItem';

import { _t } from '../../builtinCommon';

const CloseOnly = ({ name, pnlType }) => {
  return (
    <FormCheckBoxItem
      name={name}
      disabled={pnlType}
      title={_t('trade.tooltip.reduceOnly')}
      label={_t('trade.order.reduceOnly')}
    />
  );
};

export default React.memo(CloseOnly);
