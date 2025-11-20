/*
 * owner: borden@kupotech.com
 */
import React, { Fragment } from 'react';
import { isFromTMA } from 'utils/tma/isFromTMA';
import { _t, _tHTML } from 'src/utils/lang';
import ModuleTabs from '@/components/ModuleTabs';
import useInitiInLayoutIdMap from '@/hooks/useInitiInLayoutIdMap';
import { GROUP_1, GROUP_2 } from './constant';
import SettingsToolbar from '@/pages/InfoBar/SettingsToolbar';
import MInfoBar from '@/pages/InfoBar/MIndex';
import FixedButtonGroup from '@/pages/FixedButtonGroup';
import RiskTip from '@/components/RiskTip';
import { renderModule } from '../moduleConfig';
import * as Style from './style';

const XsLayout = React.memo((props) => {
  useInitiInLayoutIdMap('xs');
  return (
    <Fragment>
      <RiskTip />
      <Style.Content>
        <Style.InfoBarBox>
          <MInfoBar />
        </Style.InfoBarBox>
        <Style.TopArea>
          <ModuleTabs tabs={GROUP_1} />
        </Style.TopArea>
        <Style.AssetsBox>{renderModule('assets')}</Style.AssetsBox>
        <Style.OrderListBox>
          <ModuleTabs tabs={GROUP_2} />
        </Style.OrderListBox>
      </Style.Content>
      <Style.ButtonGroup>
        <FixedButtonGroup />
      </Style.ButtonGroup>
      {!isFromTMA() && (
        <Style.FixedBar>
          <SettingsToolbar style={{ marginRight: 0 }} />
        </Style.FixedBar>
      )}
    </Fragment>
  );
});

export default XsLayout;
