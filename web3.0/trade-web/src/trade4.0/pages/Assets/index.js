/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useContext } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import { name, WrapperContext } from './config';
import { Wrapper } from './style';
import AssetsSpot from './components/AssetsSpot';
import AssetsMargin from './components/AssetsMargin';
import AssetsIsolated from './components/AssetsIsolated';
import AssetsFutures from './components/AssetsFutures';
import Select from './components/Select';

import { MARGIN, SPOT, ISOLATED, FUTURES } from '@/meta/const';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useIsTradingBot } from '@/hooks/common/useTradeMode';
import useShowMarginMask from '@/hooks/useShowMarginMask';

const Content = (props) => {
  const { ...restProps } = props;

  const screen = useContext(WrapperContext);
  const tradeType = useTradeType();
  const isBot = useIsTradingBot();
  const MarginMask = useShowMarginMask();

  const isMd = screen === 'md';

  const componentMap = {
    [SPOT]: <AssetsSpot isMd={isMd} />,
    [MARGIN]: <AssetsMargin isMd={isMd} />,
    [ISOLATED]: <AssetsIsolated isMd={isMd} />,
    [FUTURES]: <AssetsFutures isMd={isMd} />,
  };

  const assetType = isBot ? SPOT : tradeType;
  return (
    <Wrapper className="no-scrollbar" {...restProps}>
      <Select isMd={isMd} />
      {MarginMask ? <MarginMask style={{ height: '80%' }} /> : componentMap[assetType]}
    </Wrapper>
  );
};

/**
 * Assets
 */
const Assets = () => {
  return (
    <ComponentWrapper name={name} breakPoints={[572]}>
      <Content />
    </ComponentWrapper>
  );
};

export default memo(Assets);
