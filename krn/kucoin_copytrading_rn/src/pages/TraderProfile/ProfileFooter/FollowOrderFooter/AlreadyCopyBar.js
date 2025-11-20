import {useMemoizedFn} from 'ahooks';
import React, {memo, useCallback} from 'react';
import {getBaseCurrency} from 'site/tenant';
import {RichLocale} from '@krn/ui';

import EllipsisText from 'components/Common/EllipsisText';
import {ArrowRightIcon} from 'components/Common/SvgIcon';
import UserInfoBar from 'components/copyTradeComponents/UserInfo/UserInfoBar';
import {RowWrap} from 'constants/styles';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import useLang from 'hooks/useLang';
import {gotoMainCopyPage} from 'utils/native-router-helper';
import {AlreadyCopyDayText, AlreadyCopyProfitText} from './index.styles';

const AlreadyCopyAmount = memo(({totalPnl, children}) => {
  return (
    <EllipsisText width={190}>
      <AlreadyCopyProfitText isUp={totalPnl >= 0}>
        {children}
      </AlreadyCopyProfitText>
    </EllipsisText>
  );
});

const AlreadyCopyBar = ({days, totalPnl, userInfo}) => {
  const {_t, numberFormat} = useLang();
  const {displayPrecision} = useGetUSDTCurrencyInfo();

  const renderName = useCallback(
    () => (
      <RowWrap>
        <AlreadyCopyDayText>
          <RichLocale
            // RTL语言时 文本显示异常 ，此处不进行反转 由国际化文案本身控制文字顺序
            message={`\u202D${_t('45f8d7c6defc4000a86c', {
              num: days < 1 ? '<1' : numberFormat(days),
              amount: numberFormat(totalPnl, {
                isPositive: true,
                options: {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: displayPrecision,
                },
              }),
              symbol: getBaseCurrency(),
            })}\u202C`}
            renderParams={{
              AMOUNT: {
                component: AlreadyCopyAmount,
                componentProps: {totalPnl},
              },
            }}
          />
        </AlreadyCopyDayText>
      </RowWrap>
    ),
    [_t, days, displayPrecision, numberFormat, totalPnl],
  );

  const onPress = useMemoizedFn(() => {
    gotoMainCopyPage();
  });

  return (
    <UserInfoBar userInfo={userInfo} renderName={renderName} onPress={onPress}>
      <ArrowRightIcon opacity={0.6} />
    </UserInfoBar>
  );
};

export default memo(AlreadyCopyBar);
