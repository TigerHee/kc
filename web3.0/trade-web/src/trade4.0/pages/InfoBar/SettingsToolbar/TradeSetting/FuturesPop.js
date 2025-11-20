/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useState, useMemo, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Switch from '@mui/Switch';
import Button from '@mui/Button';

import useLoginDrawer from '@/hooks/useLoginDrawer';
import { _t } from 'utils/lang';

import {
  FuturesContentWrapper,
  PopTitle,
  PopDescription,
  DrawerFooter,
  DrawerContent,
  SettingsItemText,
  SettingsItemSwitch,
  AllButton,
  RowDescription,
  RiskLimitRow,
  Divider,
} from './style';
import {
  TRADE_CONFIRM,
  MISUSE_CONFIRM,
  ALL_DIALOG_CONFIRM_KEY,
  CONFIRM_CONFIG,
  AUTO_APPEND_MARGIN_KEY,
} from './futuresConfig';

/**
 * FuturesPop
 * 风险限额
 */
const FuturesPop = (props) => {
  const { onOk } = props;
  const dispatch = useDispatch();
  const confirmConfig = useSelector((state) => state.futuresSetting.confirmConfig);
  const { open, isLogin } = useLoginDrawer();

  const confirmControlStatus = React.useMemo(() => {
    return confirmConfig.length === ALL_DIALOG_CONFIRM_KEY.length;
  }, [confirmConfig]);

  const handleSubmit = () => {
    onOk();
  };

  const handleChangeAll = () => {
    if (isLogin) {
      dispatch({
        type: 'futuresSetting/changeAllConfirmConfig',
        payload: {
          allClose: confirmControlStatus,
        },
      });
    } else {
      open();
    }
  };

  const handleChange = (v, noticeType) => {
    if (isLogin) {
      const status = v;
      dispatch({
        type: 'futuresSetting/setConfirmByBool',
        payload: {
          type: CONFIRM_CONFIG,
          value: noticeType,
          status: !status, // 设置值取反逻辑
        },
      });
    } else {
      open();
    }
  };

  return (
    <Fragment>
      <DrawerContent>
        <FuturesContentWrapper>
          {/* <PopTitle>{_t('setting.trade.confirm')}</PopTitle>
          <PopDescription>{_t('setting.trade.confirmSub')}</PopDescription>
          {TRADE_CONFIRM.map((item) => {
            return (
              <RiskLimitRow key={item.label}>
                <SettingsItemText marginLeft={'0px'}>{_t(item.label)}</SettingsItemText>
                <SettingsItemSwitch>
                  <Switch
                    onChange={(value) => handleChange(value, item.type)}
                    checked={confirmConfig.includes(item.type)}
                  />
                </SettingsItemSwitch>
              </RiskLimitRow>
            );
          })}
          <Divider /> */}
          <PopTitle>{_t('setting.misuse.confirm')}</PopTitle>
          <PopDescription>{_t('setting.misuse.confirmSub')}</PopDescription>
          {MISUSE_CONFIRM.map((item) => {
            return (
              <RiskLimitRow key={item.label}>
                <SettingsItemText marginLeft={'0px'}>{_t(item.label)}</SettingsItemText>
                <SettingsItemSwitch>
                  <Switch
                    onChange={(value) => handleChange(value, item.type)}
                    checked={confirmConfig.includes(item.type)}
                  />
                </SettingsItemSwitch>
              </RiskLimitRow>
            );
          })}
          <Divider />
          <RiskLimitRow className="sub-row">
            <SettingsItemText marginLeft={'0px'}>
              {_t('setting.autoMargin.confirm')}
              <RowDescription>{_t('setting.autoMargin.confirmSub')}</RowDescription>
            </SettingsItemText>
            <SettingsItemSwitch>
              <Switch
                onChange={(value) => handleChange(value, AUTO_APPEND_MARGIN_KEY)}
                checked={confirmConfig.includes(AUTO_APPEND_MARGIN_KEY)}
              />
            </SettingsItemSwitch>
          </RiskLimitRow>
          <AllButton onClick={handleChangeAll}>
            {_t(
              confirmControlStatus
                ? 'trade.setting.feature.allClose'
                : 'trade.setting.feature.allOpen',
            )}
          </AllButton>
        </FuturesContentWrapper>
      </DrawerContent>
      <DrawerFooter>
        <Button variant="contained" onClick={handleSubmit} loading={false} disabled={false}>
          {_t('security.form.btn')}
        </Button>
      </DrawerFooter>
    </Fragment>
  );
};

export default memo(FuturesPop);
