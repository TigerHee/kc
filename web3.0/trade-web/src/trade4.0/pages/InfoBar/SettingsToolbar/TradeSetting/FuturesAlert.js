/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import {
  FuturesContentWrapper,
  AlertDescription,
  DrawerFooter,
  DrawerContent,
  SettingsItemText,
  SettingsItemSwitch,
  AllButton,
  RiskLimitRow,
} from './style';
import { NOTICE_CONFIRM, WEB_NOTICE_CONFIG } from './futuresConfig';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Button } from '@kux/mui';
import { _t } from 'utils/lang';
import useLoginDrawer from '@/hooks/useLoginDrawer';
/**
 * FuturesAlert
 * 风险限额
 */
const FuturesAlert = (props) => {
  const { onOk } = props;
  const dispatch = useDispatch();
  const alertSettings = useSelector((state) => state.futuresSetting.webNoticeConfig);
  const { open, isLogin } = useLoginDrawer();

  const noticeControlStatus = React.useMemo(() => {
    return alertSettings.length === NOTICE_CONFIRM.length;
  }, [alertSettings]);

  const handleSubmit = () => {
    onOk();
  };

  const handleChangeAll = () => {
    if (isLogin) {
      dispatch({
        type: 'futuresSetting/changeAllNoticeConfig',
        payload: {
          allClose: noticeControlStatus,
          type: 'notice',
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
        type: 'futuresSetting/setNoticePreferencesByBool',
        payload: {
          type: WEB_NOTICE_CONFIG,
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
          <AlertDescription>{_t('trade.settingPrompt.noticeSub')}</AlertDescription>
          {NOTICE_CONFIRM.map((item) => {
            return (
              <RiskLimitRow key={item.label}>
                <SettingsItemText marginLeft={'0px'}>{_t(item.label)}</SettingsItemText>
                <SettingsItemSwitch>
                  <Switch
                    onChange={(value) => handleChange(value, item.type)}
                    checked={alertSettings.includes(item.type)}
                  />
                </SettingsItemSwitch>
              </RiskLimitRow>
            );
          })}
          <AllButton className="all-button" onClick={handleChangeAll}>
            {_t(
              noticeControlStatus
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

export default memo(FuturesAlert);
