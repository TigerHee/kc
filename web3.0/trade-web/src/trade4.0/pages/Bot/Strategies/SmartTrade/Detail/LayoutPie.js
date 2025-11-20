/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
import { handleSortPercent, timesPercent100 } from 'SmartTrade/util';
import { getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
import PieChart from 'SmartTrade/components/Charts/PieChart';
import UpdatePosition from 'SmartTrade/components/UpdatePosition';
import styled from '@emotion/styled';
import { Text, Flex } from 'Bot/components/Widgets';
import { colors } from 'SmartTrade/config';
import { floatText } from 'Bot/helper';
import { MIcons } from 'Bot/components/Common/Icon';
import { _t, _tHTML } from 'Bot/utils/lang';

const LI = styled(Text)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text60};
  .coin-name {
    position: relative;
  }
  .coin-name-${({ index }) => index}:before {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 8px;
    background-color: ${({ index }) => colors[index] ?? colors[colors.length - 1]};
    content: '';
  }
`;

export default React.memo(({ params, taskId, stopped, onFresh }) => {
  const updatePositionRef = useRef();
  const updatePosition = () => {
    if (stopped) return;
    updatePositionRef.current.toggle({
      options: {
        taskId,
        snapshots: timesPercent100(params.beforeOverview?.snapshots ?? []), // 当前仓位
        targets: timesPercent100(params.targets), // 目标仓位
        method: params.method, // 调仓方式
        totalInvestmentUsdt: params.totalInvestmentUsdt, // 总投资额
      },
    });
  };
  const data = handleSortPercent(params.targets);
  return (
    <>
      <Flex vc sb className="cursor-pointer" onClick={updatePosition} mt={16}>
        <Text color="text" className="capitalize" fs={16} fw={700}>
          {_t('smart.targetholdlayout')}
        </Text>
        {!stopped && <MIcons.ArrowRight size={16} color="icon" />}
      </Flex>
      <Flex sb>
        <div className="flex1">
          <PieChart data={data} />
        </div>
        <Flex as="ul" v hc className="flex1">
          {!!data.length && (
            <Flex vc sb as="li" fs={14} mb={12} color="text40">
              <span>{_t('smart.coin')}</span>
              <span>{_t('smart.zhanbi')}</span>
            </Flex>
          )}

          {data.map((coin, index) => {
            return (
              <LI as="li" key={coin.currency} index={index}>
                <Text className={`coin-name coin-name-${index}`}>
                  {getCurrencyName(coin.currency)}
                </Text>
                <Text fw={500} className="coin-hold">
                  {floatText(coin.formatedPercent)}
                </Text>
              </LI>
            );
          })}
        </Flex>
      </Flex>
      {!stopped && <UpdatePosition actionSheetRef={updatePositionRef} onFresh={onFresh} />}
    </>
  );
});
