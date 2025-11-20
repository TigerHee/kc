/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 20:55:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-19 10:46:18
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/TradeTypesSelect.js
 * @Description:
 */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { map } from 'lodash';
import DropdownSelect from '@/components/DropdownSelect';
import { _t, addLangToPath } from 'src/utils/lang';
import useTradeTypes from '@/hooks/common/useTradeTypes';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { styled } from '@/style/emotion';
import dropStyle from '@/components/DropdownSelect/style';
import { siteCfg } from 'config';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { commonSensorsFunc } from '@/meta/sensors';
import { isFuturesNew } from '@/meta/const';
import { getSymbolPath } from 'src/trade4.0/utils/path';

const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    align-items: center;
    height: 100%;
    padding: 0 2px 0 0;
  `,
  Icon: styled(dropStyle.Icon)`
    svg {
      fill: ${(props) => props.theme.colors.icon60};
    }
  `,
};

const DropdownSelectWrapper = styled(DropdownSelect)`
  font-size: 12px;
  .KuxDropDown-trigger {
    position: relative;
  }
  .dropdown-item {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    padding: 11px 12px;
  }
`;

const GridConfig = React.memo(() => {
  const currentSymbol = useGetCurrentSymbol();
  const url = `${siteCfg.TRADING_BOT_HOST}/spot/grid/${currentSymbol}`;

  const onClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      const newWindow = window.open(url);
      newWindow.opener = null;
    },
    [url],
  );

  return (
    <div className="inner" onClick={onClick}>
      {_t('jqywMTBuo3c43B1EcECWVk')}
    </div>
  );
});

const FuturesConfig = React.memo(() => {
  const currentSymbol = useGetCurrentSymbol();
  const currency = (currentSymbol || 'BTC-USDT').split('-')[0];
  const contractName = currency === 'BTC' ? 'XBTUSDTM' : `${currency}USDTM`;
  const url = addLangToPath(
    `${siteCfg.KUMEX_HOST}/trade/${contractName}?isQuickOrder=true&utm_source=SpotToFutures`,
  );

  const onClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      const newWindow = window.open(url);
      newWindow.opener = null;
    },
    [url],
  );

  return (
    <div className="inner" onClick={onClick}>
      {_t('tradeType.kumex')}
    </div>
  );
});

export default React.memo((props) => {
  const { showBotAndFutures, sensorKey } = props;

  const dispatch = useDispatch();
  let tradeTypes = useTradeTypes();
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const tradeType = useSelector((state) => state.trade.tradeType);

  const tradeConfig = isFuturesNew() ? [] : ['FuturesConfig'];

  // const getPath = useCallback(
  //   (item) => {
  //     const typePath = TRADE_TYPES_CONFIG[item].path;
  //     const path = concatPath(typePath, currentSymbol);
  //     return path;
  //   },
  //   [currentSymbol],
  // );

  const handleOrderTypeClick = useCallback(
    (type) => {
      if (type) {
        if (tradeConfig.indexOf(type) === -1) {
          // 使用新函数，获取path
          const { path } = getSymbolPath(type, currentSymbol);
          dispatch(routerRedux.push(path));
          if (sensorKey) {
            commonSensorsFunc([sensorKey, 2, 'click']);
          }
        }
      }
    },
    [tradeConfig, currentSymbol, dispatch, sensorKey],
  );

  tradeTypes = showBotAndFutures ? [...tradeTypes, ...tradeConfig] : [...tradeTypes];

  return (
    <DropdownSelectWrapper
      value={tradeType}
      extendStyle={DropdownExtend}
      onChange={handleOrderTypeClick}
      configs={map(tradeTypes, (item) => {
        return {
          label: () => {
            if (item === 'FuturesConfig') {
              return <FuturesConfig />;
            } else {
              return <div className="inner">{TRADE_TYPES_CONFIG[item]?.label1?.()}</div>;
            }
          },
          value: item,
          key: item,
        };
      })}
    />
  );
});
