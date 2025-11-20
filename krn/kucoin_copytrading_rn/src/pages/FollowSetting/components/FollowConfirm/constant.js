import {
  CopyModePayloadDescTranKeyMap,
  CopyModePayloadType,
  LeveragePatternType,
  StopTakeTypeEnum,
} from 'pages/FollowSetting/constant';
import React from 'react';
import {Text} from 'react-native';
import {getBaseCurrency} from 'site/tenant';

import NumberFormat from 'components/Common/NumberFormat';
import Percent from 'components/Common/Percent';
import {isValidNumber} from 'utils/helper';

export const makeConfirmDescList = (confirmDetail, {_t}) => {
  const {leveragePattern, copyMode, stopTakeDetailVOList} = confirmDetail || {};
  const accountTPSLInfo = stopTakeDetailVOList?.find(
    i => i.type === StopTakeTypeEnum.ACCOUNT,
  );
  const positionTPSLInfo = stopTakeDetailVOList?.find(
    i => i.type === StopTakeTypeEnum.OVERALL,
  );

  const isFixAmountCopyMode = copyMode === CopyModePayloadType.fixedAmount;
  return [
    {
      label: _t('74f0dc97678f4000a46d'),
      key: 'maxAmount',
      // value: '100 USDT',
      render: val =>
        !val ? (
          '-'
        ) : (
          <Text style={{fontWeight: '500'}}>
            <NumberFormat style={{fontWeight: '500'}}>{val}</NumberFormat>
            {` ${getBaseCurrency()}`}
          </Text>
        ),
    },
    isFixAmountCopyMode && {
      label: _t('d49ab2963bc94000acec'),
      key: 'perAmount',
      render: val =>
        !val ? (
          '-'
        ) : (
          <Text style={{fontWeight: '500'}}>
            <NumberFormat style={{fontWeight: '500'}}>{val}</NumberFormat>
            {` ${getBaseCurrency()}`}
          </Text>
        ),
    },
    {
      label: _t('fdccbcacf2034000a375'),
      key: 'copyMode',
      needBottomBorder: true,
      render: val =>
        CopyModePayloadDescTranKeyMap[val]
          ? _t(CopyModePayloadDescTranKeyMap[val])
          : '-',
    },
    accountTPSLInfo && {
      label: _t('fafe8e8e08624000a555'),
      key: 'accountTPSL',
      render: () => (
        <Text style={{fontWeight: '500'}}>
          {isValidNumber(accountTPSLInfo?.takeProfitRatio) ? (
            <Percent style={{fontWeight: '500'}}>
              {accountTPSLInfo?.takeProfitRatio}
            </Percent>
          ) : (
            '-'
          )}
          <Text style={{fontWeight: '500'}}> / </Text>

          {isValidNumber(accountTPSLInfo?.stopLossRatio) ? (
            <Percent style={{fontWeight: '500'}}>
              {accountTPSLInfo?.stopLossRatio}
            </Percent>
          ) : (
            '-'
          )}
        </Text>
      ),
    },
    positionTPSLInfo && {
      label: _t('62d75c98d2f04000a095'),
      key: 'positionTPSL',
      render: () => (
        <Text style={{fontWeight: '500'}}>
          {isValidNumber(positionTPSLInfo?.takeProfitRatio) ? (
            <Percent style={{fontWeight: '500'}}>
              {positionTPSLInfo?.takeProfitRatio}
            </Percent>
          ) : (
            '-'
          )}
          <Text style={{fontWeight: '500'}}> / </Text>

          {isValidNumber(positionTPSLInfo?.stopLossRatio) ? (
            <Percent style={{fontWeight: '500'}}>
              {positionTPSLInfo?.stopLossRatio}
            </Percent>
          ) : (
            '-'
          )}
        </Text>
      ),
    },
    {
      label: _t('7d653911bcb24000ad39'),
      key: 'leverage',
      render: leverage =>
        leveragePattern === LeveragePatternType.FOLLOW
          ? _t('0985a78dd54b4000af6d')
          : `${leverage}x`,
    },
    {
      label: _t('405132d6a8804000a842'),
      key: 'copyLeadAddMargin',
      render: copyLeadAddMargin =>
        copyLeadAddMargin
          ? _t('639683f559604000a7f4')
          : _t('c890c6e24d494000ae71'),
    },
  ].filter(i => !!i);
};
