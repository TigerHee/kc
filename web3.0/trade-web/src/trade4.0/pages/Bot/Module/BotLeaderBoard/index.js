/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState } from 'react';
import { Tabs } from '@mui/Tabs';
import { _t } from 'Bot/utils/lang';
import Market from './Market';
import Strategy from './Strategy';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const { Tab } = Tabs;

const strategy = 'strategy';
const market = 'market';

const tabCfg = [
  {
    value: strategy, // 策略
    reducerName: 'updateStrategyCondition',
    lang: 'strategy',
  },
  {
    value: market, // 行情
    reducerName: 'updateMarketCondition',
    lang: 'trend',
  },
];

/**
 * BotLeaderBoard
 * 机器人排行榜
 */
const BotLeaderBoard = memo((props) => {
  const { ...restProps } = props;
  const [tab, setTab] = useState('strategy');
  const handleChange = (_, v) => {
    setTab(v);
  };

  return (
    <Wrapper {...restProps}>
      <Tabs
        indicator={false}
        size="xsmall"
        value={tab}
        onChange={handleChange}
      >
        {tabCfg.map(({ value, lang }) => (
          <Tab key={value} value={value} label={_t(lang)} />
        ))}
      </Tabs>
      <Container>
        {tab === 'strategy' && <Strategy />}
        {tab === 'market' && <Market />}
      </Container>
    </Wrapper>
  );
});

export default BotLeaderBoard;
