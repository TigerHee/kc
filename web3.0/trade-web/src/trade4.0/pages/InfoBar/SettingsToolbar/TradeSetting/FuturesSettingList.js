/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-11 19:34:24
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-04 20:42:29
 * @FilePath: /trade-web/src/trade4.0/pages/InfoBar/SettingsToolbar/TradeSetting/FuturesSettingList.js
 * @Description:
 */
/**
 * Owner: charles.yang@kupotech.com
 */
import SymbolText from '@/components/SymbolText';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';
import { useGetLocalSetting, useSetLocalSetting } from '@/hooks/futures/useGetUserFuturesInfo';
import { FUTURES } from '@/meta/const';
import { ORDER_CONFIRM_CHECKED, ORDER_DATA_SAVE_CHECKED } from '@/meta/futures';
import { Switch } from '@kux/mui';
import Button from '@mui/Button';
import { useSelector } from 'dva';
import React, { Fragment, memo } from 'react';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';
import { _t } from 'utils/lang';
import CompliantRule from '@/components/CompliantRule';
import { FUTURES_NOTICE_SETTING } from '@/meta/multSiteConfig/futures';
import CompliantBox from 'src/trade4.0/components/CompliantRule/index.js';
import PNLEntry from './FuturesPNLAlert/PNLEntry';
import {
  CurrentFuturesTitle,
  Divider,
  DrawerContent,
  DrawerFooter,
  RowDescription,
  SettingsItem,
  SettingsItemSwitch,
  SettingsItemText,
  SettingsItemTip,
  SubTitle,
} from './style';

/**
 * SettingList
 * 哪些设置选项
 */
const SettingList = (props) => {
  const { onItemClick, ...restProps } = props;
  const records = useSelector((state) => state.priceWarn.records);
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const { retentionData, confirmModal } = useGetLocalSetting();
  const onSetLocalSetting = useSetLocalSetting();
  const { switchTrialFund } = useSwitchTrialFund();
  const isMobile = useIsH5();

  const orderConfirmChange = (v) => {
    onSetLocalSetting(ORDER_CONFIRM_CHECKED, v);
  };

  const orderDataSaveChange = (v) => {
    onSetLocalSetting(ORDER_DATA_SAVE_CHECKED, v);
  };

  return (
    <Fragment>
      <DrawerContent>
        {isMobile ? null : <SubTitle marginTop={'32px'}>{_t('setting.general')}</SubTitle>}
        {/* 合约产品要求：合约没有这个功能，当它是合约的时候，不展示 || m 屏下面不展示 */}
        <CompliantBox ruleId={'TRADE_TOOLBAR_SETTING_MARKETALERT'}>
          {tradeType === FUTURES || isMobile ? null : (
            <SettingsItem onClick={() => onItemClick(2)}>
              <SettingsItemText marginLeft={'0px'}>{_t('market.alert')}</SettingsItemText>
              {!!records?.length && <SettingsItemTip>{records?.length || 0}</SettingsItemTip>}
            </SettingsItem>
          )}
        </CompliantBox>
        {/* m 屏下面不展示 */}
        {isMobile ? null : (
          <SettingsItem onClick={() => onItemClick(3)}>
            <SettingsItemText marginLeft={'0px'}>{_t('7raoQR4podfEGaML3HmECr')}</SettingsItemText>
          </SettingsItem>
        )}
        <SettingsItem noIcon>
          <SettingsItemText marginLeft={'0px'}>
            {_t('setting.order.data.retention')}
            <RowDescription>{_t('setting.order.data.retention.desc')}</RowDescription>
          </SettingsItemText>
          <SettingsItemSwitch>
            <Switch checked={retentionData} onChange={orderDataSaveChange} />
          </SettingsItemSwitch>
        </SettingsItem>
        <Divider />
        <SubTitle marginTop={'24px'}>{_t('head.contracts')}</SubTitle>
        <SettingsItem noIcon>
          <SettingsItemText marginLeft={'0px'}>{_t('bots.gridwidget5')}</SettingsItemText>
          <SettingsItemSwitch>
            <Switch checked={confirmModal} onChange={orderConfirmChange} />
          </SettingsItemSwitch>
        </SettingsItem>
        {tradeType === FUTURES && !switchTrialFund ? (
          <SettingsItem onClick={() => onItemClick(4)}>
            <SettingsItemText marginLeft={'0px'}>
              <CurrentFuturesTitle>{_t('trade.settingFutures.title')}</CurrentFuturesTitle>
              <SymbolText symbol={currentSymbol} />
            </SettingsItemText>
          </SettingsItem>
        ) : null}
        <CompliantRule ruleId={FUTURES_NOTICE_SETTING}>
          <SettingsItem onClick={() => onItemClick(5)}>
            <SettingsItemText marginLeft={'0px'}>
              {_t('trade.settingPrompt.noticeTitle')}
            </SettingsItemText>
          </SettingsItem>
        </CompliantRule>
        <SettingsItem onClick={() => onItemClick(6)}>
          <SettingsItemText marginLeft={'0px'}>
            {_t('trade.settingPrompt.dialogTitle')}
          </SettingsItemText>
        </SettingsItem>
        {tradeType === FUTURES ? (
          <SettingsItem onClick={() => onItemClick(7)} itemAlign="center">
            <SettingsItemText marginLeft="0" flex="1">
              {_t('setting.pnl.alert')}
              <RowDescription>{_t('setting.pnl.desc')}</RowDescription>
            </SettingsItemText>
            <PNLEntry />
          </SettingsItem>
        ) : null}
      </DrawerContent>
      <DrawerFooter>
        <Button onClick={props?.onOk}>{_t('confirmed')}</Button>
      </DrawerFooter>
    </Fragment>
  );
};

export default memo(SettingList);
