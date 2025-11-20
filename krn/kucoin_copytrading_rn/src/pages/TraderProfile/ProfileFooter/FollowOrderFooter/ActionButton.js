import {useMemoizedFn} from 'ahooks';
import {isNil} from 'lodash';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import qaIcon from 'assets/common/profile-footer-qa-ic.png';
import Button from 'components/Common/Button';
import TipTrigger from 'components/Common/TipTrigger';
import {useAuKycLevelModalControl} from 'components/GlobalModal/MountGlobalModal/hooks/useAuKycLevelModalControl';
import {
  TRADER_ACTIVE_STATUS,
  validateLeaderConfigHelper,
} from 'constants/businessType';
import {useGotoFollowSetting} from 'hooks/copyTrade/useGotoFollowSetting';
import useKyc from 'hooks/useKyc';
import useLang from 'hooks/useLang';
import {useParams} from 'hooks/useParams';
import useTracker from 'hooks/useTracker';
import {useWithLoginFn} from 'hooks/useWithLoginFn';
import {QuestionIconImg} from './index.styles';

export const ActionButton = ({status, leadStatus, isFull}) => {
  const {gotoCreateFollowSetting} = useGotoFollowSetting();
  const {leadConfigId} = useParams();
  const {validateAndOpenKycInfo} = useKyc();
  const {validateCopyTradeKycLevelRestrict} = useAuKycLevelModalControl();

  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const doCreate = useMemoizedFn(async () => {
    const isPassKyc = await validateAndOpenKycInfo();
    if (!isPassKyc) return;

    const isPassKycLevelRestrict = await validateCopyTradeKycLevelRestrict();
    if (!isPassKycLevelRestrict) return;
    gotoCreateFollowSetting(leadConfigId);
  });

  const {run: runCreateFollowSetting} = useWithLoginFn(doCreate);

  const handlePress = useMemoizedFn(async () => {
    onClickTrack({
      blockId: 'copy',
      locationId: 'copyButton',
      properties: {
        status,
      },
    });

    if (isNil(status) || status !== TRADER_ACTIVE_STATUS.Available || isFull)
      return;
    runCreateFollowSetting();
  });

  const btnTextConfig = useMemo(() => {
    const configMap = {
      [TRADER_ACTIVE_STATUS.Freeze]: {
        text: _t('6d5885569b954000a783'),
        tip: _t('c66187681fdb4000a4dd'),
        disabled: true,
      },
      [TRADER_ACTIVE_STATUS.Disabled]: {
        text: _t('6d5885569b954000a783'),
        disabled: true,
        tip: _t('3957d4525ec94000aa2c'),
        // hidden: true,
      },
    };

    //  交易订单撤销状态
    if (validateLeaderConfigHelper.isUndoing(leadStatus)) {
      return {
        text: _t('6d5885569b954000a783'),
        tip: _t('22f9556d98114000a16a'),
        disabled: true,
      };
    }

    //交易员子账户状态
    if (status in configMap) {
      return configMap[status];
    }
    // 是否满员
    if (isFull) {
      return {
        text: _t('7b50ba37f0f04000a2a5'),
        disabled: true,
      };
    }
    // 展示去跟单按钮
    return {
      text: _t('0e7acbc3475a4000a563'),
    };
  }, [_t, isFull, leadStatus, status]);

  if (!btnTextConfig || btnTextConfig.hidden) {
    return null;
  }

  return (
    <Button
      style={css`
        flex: 1;
      `}
      disabled={btnTextConfig.disabled}
      onPress={handlePress}
      afterIcon={
        !!btnTextConfig.tip && (
          <TipTrigger
            showIcon={true}
            text={null}
            title={_t('6d5885569b954000a783')}
            message={btnTextConfig.tip}
            customIcon={
              <View
                style={css`
                  margin-left: 4px;
                `}>
                <QuestionIconImg source={qaIcon} />
              </View>
            }
          />
        )
      }>
      {btnTextConfig.text}
    </Button>
  );
};
