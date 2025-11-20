/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'dva';
import OrderTab from 'Bot/components/Common/OrderTab';
import { _t, _tHTML } from 'Bot/utils/lang';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import useCreateInfo from './hooks/useCreateInfo';
import Auto from './Auto';
import { Provider } from './model';
import Custom from './Custom';

export default ({ isActive }) => {
  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useFutureSymbolInfo(currentSymbol);
  const createInfo = useCreateInfo(currentSymbol);
  const [tab, setTab] = useState(0);
  return (
    <Provider tab={tab}>
      <OrderTab label={_t('gridform27')} label2={_t('gridform28')} value={tab} onChange={setTab} />
      {tab === 0 && <Auto show={tab === 0} createInfo={createInfo} symbolInfo={symbolInfo} />}
      {tab === 1 && <Custom show={tab === 1} createInfo={createInfo} symbolInfo={symbolInfo} />}
    </Provider>
  );
};
