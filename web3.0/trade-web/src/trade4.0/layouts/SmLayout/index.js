/*
 * owner: borden@kupotech.com
 */
import React, { Fragment } from 'react';
import * as Style from './style';
import { _t, _tHTML } from 'src/utils/lang';
import ModuleTabs from '@/components/ModuleTabs';
import useInitiInLayoutIdMap from '@/hooks/useInitiInLayoutIdMap';
import RiskTip from '@/components/RiskTip';
import { GROUP_1, GROUP_2 } from './constant';
// import { renderModule } from '../moduleConfig';
import RecommendedBar from '@/pages/RecommendedBar';
import InfoBar from '@/pages/InfoBar';
import FixedButtonGroup from '@/pages/FixedButtonGroup';

const SmLayout = React.memo((props) => {
  useInitiInLayoutIdMap('sm');
  return (
    <Fragment>
      <RiskTip />
      <Style.ScrollArea>
        <Style.Content>
          <Style.InfoBarBox>
            <InfoBar />
          </Style.InfoBarBox>
          <Style.TopArea>
            <ModuleTabs tabs={GROUP_1} />
          </Style.TopArea>
          <Style.OrderListBox>
            <ModuleTabs tabs={GROUP_2} />
          </Style.OrderListBox>
        </Style.Content>
      </Style.ScrollArea>
      <Style.ButtonGroup>
        <FixedButtonGroup />
      </Style.ButtonGroup>
      <Style.FixedBar>
        <RecommendedBar />
      </Style.FixedBar>
    </Fragment>
  );
});

export default SmLayout;
