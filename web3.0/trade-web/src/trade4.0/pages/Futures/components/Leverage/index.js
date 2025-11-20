/**
 * Owner: garuda@kupotech.com
 * 调整杠杆
 */
import React from 'react';

import loadable from '@loadable/component';

import { MARGIN_MODE_ISOLATED } from '@/meta/futures';

import { useLeverageProps } from './hooks';

const CrossLeverageDialog = loadable(() =>
  import(/* webpackChunkName: 'cross-leverage-dialog' */ './CrossLeverageDialog'),
);

const IsolatedLeverageDialog = loadable(() =>
  import(/* webpackChunkName: 'isolated-leverage-dialog' */ './IsolatedLeverageDialog'),
);

const Leverage = () => {
  const { visible, symbol, marginMode, onClose } = useLeverageProps();

  if (!visible) return null;

  return (
    <>
      {marginMode === MARGIN_MODE_ISOLATED ? (
        <IsolatedLeverageDialog open={visible} symbol={symbol} onClose={onClose} />
      ) : (
        <CrossLeverageDialog open={visible} symbol={symbol} onClose={onClose} />
      )}
    </>
  );
};

export default React.memo(Leverage);
