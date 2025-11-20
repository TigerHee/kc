/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'dva';
// import Tooltip from '@mui/Tooltip';
import Dropdown from '@mui/Dropdown';
import Checkbox from '@mui/Checkbox';
import { useTradeType } from '@/hooks/common/useTradeType';
import { getSingleModule } from '@/layouts/utils';
import { FUTURES } from '@/meta/const';
import { namespace } from '@/pages/Chart/config';
import { KLINE_EXTRATOOL } from '@/storageKey/chart';
import storage from '@/pages/Chart/utils/index';
import { _t } from 'utils/lang';
import { OverlayWrapper, HeaderIcon, HeaderIconItem } from './style';

const { setItem } = storage;

const Overlay = memo(() => {
  const tradeType = useTradeType();
  const dispatch = useDispatch();
  const extraToolConfig = useSelector((state) => state[namespace].extraToolConfig);
  const options = useMemo(() => {
    if (tradeType === FUTURES) {
      return [
        {
          key: 'openOrderFutures',
          label: _t('orders.c.order.cur'),
        },
        // 本期没有历史委托
        // {
        //   key: 'historyOrderFutures',
        //   label: _t('orders.c.order.history'),
        // },
        {
          key: 'positions',
          label: _t('dAS86Y9YkZeYWpoNs7EWcA'),
        },
      ];
    } else {
      return [
        {
          key: 'openOrder',
          label: _t('orders.c.order.cur'),
        },
        {
          key: 'historyOrder',
          label: _t('orders.c.order.history'),
        },
      ];
    }
  }, [tradeType]);

  const handleCheckboxChange = useCallback(
    (e, key) => {
      const data = {
        ...extraToolConfig,
        [key]: !!e?.target?.checked,
      };
      dispatch({
        type: `${namespace}/update`,
        payload: {
          extraToolConfig: data,
        },
      });
      setItem(KLINE_EXTRATOOL, data);
    },
    [dispatch, extraToolConfig],
  );

  return (
    <OverlayWrapper>
      {options.map(({ key, label }) => (
        <div className="dropdown-item" key={key}>
          <Checkbox onChange={(e) => handleCheckboxChange(e, key)} checked={extraToolConfig[key]}>
            {label}
          </Checkbox>
        </div>
      ))}
    </OverlayWrapper>
  );
});

export default () => {
  const { isSingle } = getSingleModule();
  const tradeMode = useSelector((state) => state.trade.tradeMode);

  if (isSingle || tradeMode !== 'MANUAL') {
    return null;
  }
  return (
    <Dropdown holdDropdown trigger="hover" overlay={<Overlay />}>
      <HeaderIconItem>
        <HeaderIcon type="list" size={16} fileName="chart" />
      </HeaderIconItem>
    </Dropdown>
  );
};
