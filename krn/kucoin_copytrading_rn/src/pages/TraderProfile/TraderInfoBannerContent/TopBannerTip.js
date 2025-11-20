import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import Alert from 'components/Common/Alert';
import {TinyWarning} from 'components/Common/SvgIcon';
import {
  LEAD_CONFIG_STATUS,
  TRADER_ACTIVE_STATUS,
  validateLeaderConfigHelper,
} from 'constants/businessType';
import useLang from 'hooks/useLang';
import {isUndef} from 'utils/helper';
import {useIsMySelf} from '../hooks/useVisibilityHandler';
import {TopBannerTipArea, TopBannerTipText} from './styles';

const TIP_ACTIVE_STATUS_TEXT_KEY_MAP = {
  [TRADER_ACTIVE_STATUS.Freeze]: 'c66187681fdb4000a4dd',
  [TRADER_ACTIVE_STATUS.Disabled]: '22f9556d98114000a16a',
};

const ApprovalTip = ({status, leadStatus}) => {
  const {_t} = useLang();

  const showTipText = useMemo(() => {
    // 如果子账号状态为 2, config状态为 0，表示 初始(未激活) 状态
    if (
      leadStatus === LEAD_CONFIG_STATUS.CLOSED &&
      status === TRADER_ACTIVE_STATUS.Freeze
    ) {
      return _t('3cb7f9af32854000ab33');
    }
    if (TIP_ACTIVE_STATUS_TEXT_KEY_MAP[status]) {
      _t(TIP_ACTIVE_STATUS_TEXT_KEY_MAP[status]);
    }
    return '';
  }, [_t, leadStatus, status]);

  if (
    isUndef(status) ||
    status === TRADER_ACTIVE_STATUS.Available ||
    !showTipText
  ) {
    return null;
  }

  return (
    <TopBannerTipArea>
      <View style={{marginTop: 2}}>
        <TinyWarning />
      </View>
      <TopBannerTipText>{showTipText}</TopBannerTipText>
    </TopBannerTipArea>
  );
};

export const TopBannerTip = memo(({status, leadStatus}) => {
  const {_t} = useLang();
  const isMySelf = useIsMySelf();

  const isUndoing =
    validateLeaderConfigHelper.isUndoing(leadStatus) &&
    status !== TRADER_ACTIVE_STATUS.Freeze;
  // 当带单人本人时展示 撤销中提示
  if (isMySelf && isUndoing) {
    return (
      <Alert
        style={css`
          margin-bottom: 16px;
        `}
        message={_t('e5b7281e36324000a303')}
      />
    );
  }

  return <ApprovalTip status={status} leadStatus={leadStatus} />;
});
