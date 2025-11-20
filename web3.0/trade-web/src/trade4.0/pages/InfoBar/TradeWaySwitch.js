/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { routerRedux } from 'dva/router';
import { _t } from 'utils/lang';
import { useDispatch } from 'dva';
import { TRADEMODE_META, TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { isFuturesNew } from '@/meta/const';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useTradeMode } from '@/hooks/common/useTradeMode';
import { trackClick } from 'utils/ga';
import { concatPath } from 'helper';
import { useTradeType } from '@/hooks/common/useTradeType';
import TradeSetting from './SettingsToolbar/TradeSetting';
import { getSymbolIsSupportTradeType } from 'src/trade4.0/hooks/common/useTradeType.js';
import { getStateFromStore } from '@/utils/stateGetter';
import isEmpty from 'lodash/isEmpty';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import { isDisplayBotStrategy } from '@/meta/multiTenantSetting';
import PerksEntry from './SettingsToolbar/PerksEntry';
import { FUTURES_TH_PERKS } from 'src/trade4.0/meta/multSiteConfig/futures';
import { useDisplayRule } from '@/components/CompliantRule/hook';

const Box = styled.div`
  border-radius: 80px;
  background: ${({ theme }) => theme.colors.cover8};
  height: 32px;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
`;
const Item = styled.a`
  flex: 1;
  border-radius: 80px;
  padding: 0 12px;
  height: 28px;
  min-width: 64px;
  text-align: center;
  line-height: 28px;
  white-space: nowrap;
  background: ${({ active, theme }) => (active ? theme.colors.overlay : 'transparent')};
  color: ${({ active, theme }) => theme.colors[active ? 'text' : 'text60']};
  transition: color 0.3s linear;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;
let go_botMode_tradeType_before;
/**
 * @description: 当在策略模式下，点击手动模式的情况， 交易对是现货情况， 需要判断是否返回杠杆
 * @param {*} symbol
 * @param {*} tradeMode
 * @param {*} tradeType
 * @return {*}
 */
const getTradeTypeForMargin = ({ symbol, tradeMode, tradeType }) => {
  if (tradeMode === TRADEMODE_META.keys.BOTTRADE) {
    if (tradeType === TRADE_TYPES_CONFIG.TRADE.key && isSpotTypeSymbol(symbol)) {
      const last_tradeType = go_botMode_tradeType_before;
      // 如果上次是杠杆， 看交易对是否支持
      if (
        [
          TRADE_TYPES_CONFIG.MARGIN_TRADE.key,
          TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key,
        ].includes(last_tradeType)
      ) {
        const { fallbackType } = TRADE_TYPES_CONFIG[last_tradeType] || {};
        const marginSymbolsMap = getStateFromStore((state) => state.symbols?.marginSymbolsMap);
        if (isEmpty(marginSymbolsMap)) {
          // 无法判读是否支持
          return tradeType;
        }
        if (getSymbolIsSupportTradeType({ symbol, tradeType: last_tradeType, marginSymbolsMap })) {
          return last_tradeType;
        } else if (
          getSymbolIsSupportTradeType({ symbol, marginSymbolsMap, tradeType: fallbackType })
        ) {
          return fallbackType;
        }
      }
    }
  }

  return tradeType;
};

const getPath = ({ currentSymbol, tradeType, tradeMode }) => {
  if (!tradeType) return '';

  const willTradeType = getTradeTypeForMargin({ symbol: currentSymbol, tradeMode, tradeType });

  const typePath = TRADE_TYPES_CONFIG[willTradeType]?.path;
  if (!typePath) return '';
  const path = concatPath(typePath, currentSymbol);
  return path;
};

const tabConfig = [
  {
    key: 'manualtrade',
    value: TRADEMODE_META.keys.MANUAL,
    storageKey: 'manualtrade_path',
    formatPath: getPath,
    formatSEOPath: ({ currentSymbol, tradeType, tradeMode }) =>
      `/trade${getPath({ currentSymbol, tradeType, tradeMode })}`,
    sensor: '0',
  },
  {
    key: 'bottrade',
    value: TRADEMODE_META.keys.BOTTRADE,
    storageKey: 'tradingbot_path',
    formatPath: ({ currentSymbol }) => `${TRADEMODE_META.botTradeMeta.path}/${currentSymbol}`,
    formatSEOPath: ({ currentSymbol }) =>
      `/trade${TRADEMODE_META.botTradeMeta.path}/${currentSymbol}`,
    sensor: '1',
  },
];

const TradeWaySwitch = React.memo(() => {
  const tradeMode = useTradeMode();
  const currentSymbol = useGetCurrentSymbol();
  const dispatch = useDispatch();
  const tradeType = useTradeType();

  const clickHandle = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    trackClick(['toggleStrategy', item.sensor]);
    if (item.key === 'bottrade') {
      // 记录点击策略模式前的tradeType
      go_botMode_tradeType_before = tradeType;
    }
    dispatch(routerRedux.replace(item.formatPath({ currentSymbol, tradeType, tradeMode })));
  };
  return (
    <Box>
      {tabConfig.map((item) => {
        return (
          <Item
            active={item.value === tradeMode}
            onClick={(e) => clickHandle(e, item)}
            key={item.key}
            href={item.formatSEOPath({ currentSymbol, tradeType, tradeMode })}
          >
            {_t(item.key)}
          </Item>
        );
      })}
    </Box>
  );
});
export default TradeWaySwitch;

const Row = styled.div`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.overlay};
  border-bottom: 1px solid ${(props) => props.theme.colors.cover8};
  display: flex;
  justify-content: space-between;
  .flex-center {
    display: flex;
    align-items: center;
  }
`;
/**
 * @description: 小屏幕下显示一行
 * @return {*}
 */
export const TradeWaySwitchRow = () => {
  const isSiteShow = useDisplayRule(FUTURES_TH_PERKS);
  return (
    <Row>
      {isDisplayBotStrategy() && <TradeWaySwitch /> }
      {isFuturesNew() ? (<div className="flex-center">
          { isSiteShow ? <PerksEntry /> : <></>}
          <TradeSetting />
        </div>) : null}
    </Row>
  );
};
