import {useMemoizedFn} from 'ahooks';
import React, {memo, useMemo, useRef, useState} from 'react';
import {showToast} from '@krn/bridge';

import Button from 'components/Common/Button';
import {
  LEAD_CONFIG_STATUS,
  TRADER_ACTIVE_STATUS,
  validateLeaderConfigHelper,
} from 'constants/businessType';
import {RouterNameMap} from 'constants/router-name-map';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {OnProcessingOrderAlertModal} from '../components/OnProcessingOrderAlertModal';
import SettingActionSheet from '../components/SettingActionSheet';
import {ProfileFooterArea} from '../components/styles';
import {usePullLeadOrderPositionInfo} from '../hooks/useSharingProfitQuery';

const SelfSettingFooter = ({summaryData}) => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const {leadStatus, status} = summaryData || {};
  const onProcessingAlertRef = useRef(null);
  const [isShowMyTraderSetting, setSettingShow] = useState(false);
  const {push} = usePush();
  const {
    data: leadOrderInfoResp,
    isSuccess,
    refetch: refetchLeadOrderPositionInfo,
  } = usePullLeadOrderPositionInfo();
  const leadOrderInfo = leadOrderInfoResp?.data || {};
  const openSettingDrawer = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'setting',
    });
    setSettingShow(true);
  };
  const selectRevertLead = useMemoizedFn(async () => {
    if (status === TRADER_ACTIVE_STATUS.Freeze) {
      if (leadStatus === LEAD_CONFIG_STATUS.CLOSED) {
        showToast(_t('77ce9ed8504e4000aa44'));
        return;
      }
      showToast(_t('ed2e7ecdd6af4000abb0'));
      return;
    }

    if (validateLeaderConfigHelper.isUnNormal(leadStatus)) {
      showToast(_t('1ef22a1957704000ae2f'));
      return;
    }

    let isFetchedLeadOrderInfo = leadOrderInfo;
    if (!isSuccess) {
      const {data: resp} = await refetchLeadOrderPositionInfo();
      isFetchedLeadOrderInfo = resp?.data || {};
    }
    const {positionNum, orderNum} = isFetchedLeadOrderInfo;
    // 有未平仓位与挂单 出拦截弹窗
    if (positionNum > 0 || orderNum > 0) {
      onProcessingAlertRef.current.open();
      return;
    }

    push(RouterNameMap.UndoIdentity);
  });

  const options = useMemo(
    () => [
      // {
      //   label: '带单设置',
      //   icon: 'SettingIcon',
      //   value: 'name',
      //   routeName: 'UndoIdentity',
      // },
      {
        label: _t('f5a79cd6f0734000a5b5'),
        icon: 'UndoIcon',
        value: 'undo',
        routeName: 'UndoIdentity',
        onPress: selectRevertLead,
      },
    ],
    [_t, selectRevertLead],
  );

  return (
    <>
      <ProfileFooterArea>
        <Button onPress={openSettingDrawer}>
          {_t('0ff2cfa5547f4000a2c1')}
        </Button>
      </ProfileFooterArea>

      <OnProcessingOrderAlertModal
        leadOrderInfo={leadOrderInfo}
        ref={onProcessingAlertRef}
      />

      <SettingActionSheet
        options={options}
        show={isShowMyTraderSetting}
        toggleSheet={setSettingShow}
      />
    </>
  );
};

export default memo(SelfSettingFooter);
