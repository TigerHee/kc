/*
 * @Owner: borden@kupotech.com
 * @Date: 2023-05-06 10:28:02
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-11 09:44:33
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/index.js
 * @Description:
 */
import React, { Suspense } from 'react';
import styled from '@emotion/styled';
import Divider from '@mui/Divider';
import { _t } from 'utils/lang';
import SymbolSwitch from '@/pages/InfoBar/SymbolSwitch';
import RealTimeMarketInfo from '@/pages/InfoBar/RealTimeMarketInfo';
import { getSingleModule } from '@/layouts/utils';
import { useResponsive } from '@kux/mui';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import FuturesDetail from './FuturesDetail';
import { useResize } from './hooks/useResize';
import More from './FuturesDetail/More';
import { isDisplayBotStrategy } from '@/meta/multiTenantSetting';
import TradeWaySwitch from './TradeWaySwitch';
import Gap from './Gap';

/** 样式开始 */
const Container = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: ${(props) => props.theme.colors.overlay};
  .rightBox {
    position: relative;
    z-index: 1;
    height: 48px;
  }
`;
const LeftBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  overflow-x: hidden;
`;

const WrapperSwitch = styled.div`
  display: flex;
  align-items: center;
`;
/** 样式结束 */

// 部分响应式尺寸下没有布局设置
const SettingsToolbar = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-settingsToolbar' */ './SettingsToolbar');
});

const InfoBar = React.memo((props) => {
  const { isSingle } = getSingleModule();
  const screens = useResponsive();
  const { sm } = screens; // 1280 以上展示 返回旧版本和布局，1280以下并切隐藏文案

  // 合约融合
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const { leftRef, rightRef, resetMore } = useResize();

  return (
    <Container className="infoBar" data-inspector="tradeV4_infoBar">
      <LeftBox className="leftBox" ref={leftRef}>
        {!isSingle && isDisplayBotStrategy() && (
          <WrapperSwitch className="robotCls">
            <TradeWaySwitch />
            <Divider type="vertical" />
          </WrapperSwitch>
        )}
        <SymbolSwitch />
        {isFutures ? <FuturesDetail /> : <RealTimeMarketInfo />}
      </LeftBox>
      <Gap resetFuturesMore={isFutures ? resetMore : () => {}} />
      <div className="rightBox" ref={rightRef}>
        {isFutures ? <More /> : <></>}
        {!isSingle && sm && (
          <Suspense fallback={<div />}>
            <SettingsToolbar />
          </Suspense>
        )}
      </div>
    </Container>
  );
});

export default InfoBar;
