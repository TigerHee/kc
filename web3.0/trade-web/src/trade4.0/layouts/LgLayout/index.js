/*
 * owner: borden@kupotech.com
 */
import React, { Fragment } from 'react';
import * as Style from './style';
import { _t, _tHTML } from 'src/utils/lang';
import ModuleTabs from '@/components/ModuleTabs';
import RiskTip from '@/components/RiskTip';
import useInitiInLayoutIdMap from '@/hooks/useInitiInLayoutIdMap';
import { GROUP_1, GROUP_2 } from './constant';
import { renderModule } from '../moduleConfig';
import RecommendedBar from 'src/trade4.0/pages/RecommendedBar';
import InfoBar from '@/pages/InfoBar';

const LgLayout = React.memo(() => {
  useInitiInLayoutIdMap('lg');
  return (
    <Fragment>
      <RiskTip />
      <Style.ScrollArea>
        <Style.Content>
          <Style.InfoBarBox>
            <InfoBar />
          </Style.InfoBarBox>
          <Style.TopArea>
            <Style.TopAreaLeft>
              <Style.TopAreaLeftTop>
                <ModuleTabs tabs={GROUP_1} />
              </Style.TopAreaLeftTop>
              <Style.TopAreaLeftBottom>
                <Style.OrderBookBox>{renderModule('orderBook')}</Style.OrderBookBox>
                <Style.RecentTradeBox>{renderModule('recentTrade')}</Style.RecentTradeBox>
              </Style.TopAreaLeftBottom>
            </Style.TopAreaLeft>
            <Style.TopAreaRight>
              <Style.TradeFormBox>{renderModule('orderForm')}</Style.TradeFormBox>
              <Style.AssetsBox>{renderModule('assets')}</Style.AssetsBox>
            </Style.TopAreaRight>
          </Style.TopArea>
          <Style.OrderListBox>
            <ModuleTabs tabs={GROUP_2} />
          </Style.OrderListBox>
        </Style.Content>
      </Style.ScrollArea>
      <Style.FixedBar>
        <RecommendedBar />
      </Style.FixedBar>
    </Fragment>
  );
});

export default LgLayout;
