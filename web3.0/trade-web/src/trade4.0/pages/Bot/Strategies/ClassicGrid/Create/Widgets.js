/**
 * Owner: mike@kupotech.com
 */
import React, { useLayoutEffect, useState } from 'react';
import { ChangeRate } from 'Bot/components/ColorText';
import { Text, Divider } from 'Bot/components/Widgets';
import LabelPopover from 'Bot/components/Common/LabelPopover';
import { _t, _tHTML } from 'Bot/utils/lang';
import Row from 'Bot/components/Common/Row';
import { useSelector, useDispatch } from 'dva';
/**
 * @description: 历史回测
 * @param {*} React
 * @return {*}
 */
export const BackTest = React.memo(({ symbolCode: symbol }) => {
  const [time] = useState(7);
  const allBacktest = useSelector((state) => state.classicgrid.backtest);
  const backtest = allBacktest[symbol] ?? {
    gridProfit: 0,
    maxLoss: 0,
    maxProfit: 0,
  };
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch({
      type: 'classicgrid/getBackTest',
      payload: {
        symbol,
        templateType: 1,
        time,
      },
    });
  }, [symbol, time]);

  if (!Number(backtest.maxProfit)) return null;
  return (
    <>
      <div>
        <LabelPopover label={_t('vBPUZanZpU8x3SpdNHekmL')} content={_t('w25cYrxNMracobQ2CoctZK')} />
        <Row
          fs={12}
          mt={8}
          mb={8}
          labelColor="text40"
          label={`${_t('1VLUmTJDs5u5AyoPsgU3Nt')}(7D)`}
          value={<ChangeRate value={backtest.maxProfit} hasUnit={false} />}
        />
        <Row
          fs={12}
          labelColor="text40"
          label={`${_t('card8')}(${_t('ARP')})`}
          value={<ChangeRate value={Number(backtest.gridProfit) * 52} hasUnit={false} />}
        />
      </div>
      <Divider />
    </>
  );
});

export const Parameter = ({ className }) => (
  <LabelPopover
    className={className}
    label={_t('76RRv418Q2eESJ2LGohsgo')}
    textProps={{ fs: 14, color: 'text' }}
    content={
      <>
        <Text fs={14} fw={500} as="div">
          {_t('futrgrid.pricerange')}
        </Text>
        <Text fs={12} as="p">
          {_t('futrgrid.classgridrangehint')}
        </Text>

        <Text fs={14} fw={500} as="div">
          {_t('gridform15')}
        </Text>
        <Text fs={12} as="p">
          {_t('gridformTip6')}
        </Text>
      </>
    }
  />
);
