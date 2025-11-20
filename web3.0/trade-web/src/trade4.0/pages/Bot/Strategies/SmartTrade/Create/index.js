/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import OrderTab from 'Bot/components/Common/OrderTab';
import { _t, _tHTML } from 'Bot/utils/lang';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import InverstCompose from './InverstCompose';
import Custom from './Custom';

export default () => {
  const currentSymbol = useGetCurrentSymbol();
  const [tab, setTab] = useState(0);
  return (
    <div>
      <OrderTab
        label={_t('jEF7Goc3rAnaMun5q3m5zJ')}
        label2={_t('gridform28')}
        value={tab}
        onChange={setTab}
        mb={12}
      />
      {tab === 0 && (
        <InverstCompose show={tab === 0} currentSymbol={currentSymbol} changeTab={setTab} />
      )}
      {tab === 1 && <Custom show={tab === 1} currentSymbol={currentSymbol} />}
    </div>
  );
};
