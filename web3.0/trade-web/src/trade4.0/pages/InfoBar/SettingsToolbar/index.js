/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-15 11:51:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-14 21:03:18
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/SettingsToolbar/index.js
 * @Description:
 */
/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useCallback, Fragment } from 'react';
import { useResponsive } from '@kux/mui';
import { ToolBarWrapper, DividerWrapper, BackClassicVersion } from './style';
import Wifi from './Wifi';
import News from './News';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from '@/meta/const';
import TradeInfomation from './TradeInfomation';
import TradeSetting from './TradeSetting';
import LayoutBtn from '../LayoutSetting/LayoutBtn';
import Tutorial from './Tutorial';
import { _t } from 'src/utils/lang';
import { useItemClick } from '@/pages/InfoBar/SettingsToolbar/TradeInfomation/useInformationProps';
import { isDisplayFeeInfo } from '@/meta/multiTenantSetting';
import CompliantBox from 'src/trade4.0/components/CompliantRule/index.js';
import { COMPLIANT_BOX_SPM_CONFIG } from 'src/trade4.0/meta/multiTenantSetting.js';

import CompliantRule from '@/components/CompliantRule';
import { FUTURES_COMPLIANT_SPM, FUTURES_TH_PERKS } from '@/meta/multSiteConfig/futures';

import PerksEntry from './PerksEntry';

const styles = {
  marginRight: 'auto',
  marginLeft: 'auto',
  opacity: 0,
};
/**
 * SettingsToolbar
 * 右边设置工具栏
 */
const SettingsToolbar = (props) => {
  const { ...restProps } = props;
  const onItemClick = useItemClick();
  const screens = useResponsive();
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;

  const { xl, sm } = screens; // 1280 以上展示 返回旧版本和布局，1280以下并切隐藏文案

  return (
    <ToolBarWrapper className="toolbar-footer" {...restProps} fixed={!sm}>
      {/* 1 月 11 日，下掉返回旧版 按钮
      {xl && (
        <Fragment>
          <BackClassicVersion
            icon="classic-version"
            text={_t('sSdobTF8Qn5fzJK4ptNWkm')}
            onClick={() => onItemClick('CHANGEVERSION')}
          />
          <DividerWrapper type="vertical" />
        </Fragment>
      )} */}
      <Wifi style={!sm ? { marginRight: 'auto' } : {}} />
      {sm && isFutures && (<>
        <CompliantRule ruleId={FUTURES_TH_PERKS} spm={FUTURES_COMPLIANT_SPM.FUTURES_PERKS_SPM}>
          <DividerWrapper type="vertical" style={!sm ? styles : {}} />
          <PerksEntry />
        </CompliantRule>
      </>)}
      <DividerWrapper type="vertical" style={!sm ? styles : {}} />
      <CompliantBox ruleId={'TRADE_TOOLBAR_NEWS'} spm={COMPLIANT_BOX_SPM_CONFIG.HideNews}>
        <News />
      </CompliantBox>
      <CompliantBox ruleId={'TRADE_TOOLBAR_INFO'}>
        <TradeInfomation />
      </CompliantBox>
      <CompliantBox ruleId={'TRADE_TOOLBAR_TUTORIAL'}>
        <DividerWrapper type="vertical" />
        <Tutorial />
      </CompliantBox>
      {xl && <LayoutBtn />}
      {sm && <TradeSetting />}
    </ToolBarWrapper>
  );
};

export default memo(SettingsToolbar);
