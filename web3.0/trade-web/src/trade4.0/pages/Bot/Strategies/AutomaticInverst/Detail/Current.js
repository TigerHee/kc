/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import OpenOrdersStartOk from 'Bot/components/Common/OpenOrdersStartOk';
import useTicker from 'Bot/hooks/useTicker';
import { formatNumber } from 'Bot/helper';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import PolyChart from '../components/PolyChart';
import Row from 'Bot/components/Common/Row';
import SymbolPrice from 'Bot/components/Common/SymbolPrice';
import { ChangeRate, Profit } from 'Bot/components/ColorText';
import { Text } from 'Bot/components/Widgets';
/**
 * @description:
 * @param {*} open
 * @param {*} symbolInfo
 * @return {*}
 */
const Block = ({ open, symbolInfo }) => {
  const { base, quota, symbolNameText, pricePrecision, quotaPrecision, basePrecision, symbolCode } =
    symbolInfo;

  return (
    <div className="mt-16">
      <Row
        fs={20}
        label={symbolNameText}
        labelColor="text"
        value={
          <SymbolPrice
            symbolCode={symbolCode}
            lastTradedPrice={open.symbolCurrentPrice}
          />
        }
      />
      <Row label={_t('auto.hadqishu')} value={formatNumber(open.investedNum)} />
      <Row
        label={_t('auto.commonbuyprice')}
        value={formatNumber(open.avgBuyPrice, quotaPrecision)}
        unit={quota}
      />
      {!!open.maxBuyPrice && (
        <Row
          label={_t('auto.buypricelimit')}
          value={formatNumber(open.maxBuyPrice, pricePrecision)}
          unit={quota}
        />
      )}
      <Row
        label={_t('auto.hasinverstnum')}
        value={formatNumber(open.totalCost, quotaPrecision)}
        unit={quota}
      />
      {!!open.maxTotalCost && (
        <Row
          label={_t('auto.inverstuplimit')}
          value={formatNumber(open.maxTotalCost, quotaPrecision)}
          unit={quota}
        />
      )}

      <Row
        label={_t('auto.currentbasehold', { base })}
        value={formatNumber(open.totalSize, basePrecision)}
      />
      <Row
        label={_t('auto.currentprofit')}
        value={
          <Text color="text">
            <Profit value={open.profit} precision={3} />
            &nbsp;
            <ChangeRate value={open.profitRate} prefix="(" suffix=")" />
          </Text>
        }
        unit={quota}
      />
    </div>
  );
};
export default ({ isActive, onClose, runningData: { id, symbol, status }, mode }) => {
  const symbolInfo = useSpotSymbolInfo(symbol);
  const open = useSelector((state) => state.automaticinverst.open);
  const CurrentLoading = useSelector((state) => state.automaticinverst.CurrentLoading);
  const dispatch = useDispatch();
  const fresh = useCallback(() => {
    dispatch({
      type: 'automaticinverst/getOpenOrders',
      payload: {
        taskId: id,
        symbol,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);

  if (CurrentLoading) return null;
  if (isEmpty(open)) {
    return <OpenOrdersStartOk isActive={isActive} />;
  }

  return (
    <div>
      <PolyChart open={open} symbolInfo={symbolInfo} />
      <Block open={open} symbolInfo={symbolInfo} />
    </div>
  );
};
