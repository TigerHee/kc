/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import {
  DrawerContent,
  DrawerFooter,
  SettingsItem,
  SettingsItemText,
  SettingsItemTip,
  SettingsItemIcon,
  RowDescription,
  SettingsItemSwitch,
} from './style';
import Button from '@mui/Button';
import { useSelector } from 'dva';
import { _t } from 'utils/lang';
import { useIsRTL } from '@/hooks/common/useLang';
import { useGetLocalSetting, useSetLocalSetting } from '@/hooks/futures/useGetUserFuturesInfo';
import { ORDER_CONFIRM_CHECKED, ORDER_DATA_SAVE_CHECKED } from '@/meta/futures';
import { Switch } from '@kux/mui';
import CompliantBox from 'src/trade4.0/components/CompliantRule/index.js';
/**
 * SettingList
 * 哪些设置选项
 */
const SettingList = (props) => {
  const { onItemClick, ...restProps } = props;
  const isRtl = useIsRTL();
  const records = useSelector((state) => state.priceWarn.records);
  const { retentionData, confirmModal } = useGetLocalSetting();
  const onSetLocalSetting = useSetLocalSetting();
  const orderDataSaveChange = (v) => {
    onSetLocalSetting(ORDER_DATA_SAVE_CHECKED, v);
  };
  return (
    <Fragment>
      <DrawerContent>
        <CompliantBox ruleId={'TRADE_TOOLBAR_SETTING_MARKETALERT'}>
          <SettingsItem noIcon hasMargin isRtl={isRtl} onClick={() => onItemClick(2)}>
            {/* <SettingsItemIcon fileName="toolbar" type={'alert'} /> */}
            <SettingsItemText marginLeft={'0px'}>{_t('market.alert')}</SettingsItemText>
            {!!records?.length && <SettingsItemTip>{records?.length || 0}</SettingsItemTip>}
          </SettingsItem>
        </CompliantBox>
        <SettingsItem noIcon isRtl={isRtl} onClick={() => onItemClick(3)}>
          {/* <SettingsItemIcon fileName="toolbar" type={'announcement'} /> */}
          <SettingsItemText marginLeft={'0px'}>{_t('7raoQR4podfEGaML3HmECr')}</SettingsItemText>
        </SettingsItem>
        <SettingsItem noIcon>
          <SettingsItemText marginLeft={'0px'}>
            {_t('setting.order.data.retention')}
            <RowDescription>{_t('setting.order.data.retention.desc')}</RowDescription>
          </SettingsItemText>
          <SettingsItemSwitch>
            <Switch checked={retentionData} onChange={orderDataSaveChange} />
          </SettingsItemSwitch>
        </SettingsItem>
      </DrawerContent>
      <DrawerFooter>
        <Button onClick={props?.onOk}>{_t('confirmed')}</Button>
      </DrawerFooter>
    </Fragment>
  );
};

export default memo(SettingList);
