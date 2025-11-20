import React, {memo, useMemo} from 'react';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';

import Card from 'components/Common/Card';
import Descriptions from 'components/Common/Descriptions';
import NumberFormat from 'components/Common/NumberFormat';
import Percent from 'components/Common/Percent';
import {Number} from 'components/Common/UpOrDownNumber';
import {TPSLControlBar} from 'components/copyTradeComponents/TPSLControlBar';
import {TPSLControlType} from 'components/copyTradeComponents/TPSLControlBar/constant';
import {UserInfoBar} from 'components/copyTradeComponents/UserInfo';
import useLang from 'hooks/useLang';
import {CancelCopyFailHeader} from './components/CancelCopyFailHeader';
import PnlInfo from './components/PnlInfo';
import {ShortDateTimeFormat} from './components/ShortDateTimeFormat';
import {UserInfoBarRightArea} from './components/UserInfoBarRightArea';
import {useClick} from './hooks/useClick';
import {StyledText} from './styles';

const makeCurrentTradingItems = (_t, info) => {
  const {copyAmount, profitSharingRatio, startDate, todayPnl} = info;

  return [
    {
      label: _t('9da1781b73bc4000a54b', {symbol: getBaseCurrency()}),
      key: 'todayPnl',
      children: (
        <StyledText>
          <Number
            style={css`
              font-weight: 500;
            `}
            isProfitNumber>
            {todayPnl}
          </Number>
        </StyledText>
      ),
    },
    {
      label: _t('6a045433504b4000aef2', {symbol: getBaseCurrency()}),
      key: 'currentInvestment',
      children: (
        <StyledText>
          <NumberFormat
            style={css`
              font-weight: 500;
            `}
            isAumNumber>
            {copyAmount}
          </NumberFormat>
        </StyledText>
      ),
    },
    {
      label: _t('c9e75b81a8324000a85f'),
      key: 'Profit',
      children: (
        <StyledText>
          <Percent
            style={css`
              font-weight: 500;
            `}>
            {profitSharingRatio}
          </Percent>
        </StyledText>
      ),
    },

    {
      label: _t('d3e7070d68354000a028'),
      key: 'Date',
      children: (
        <StyledText>
          <ShortDateTimeFormat
            style={css`
              font-weight: 500;
            `}>
            {startDate}
          </ShortDateTimeFormat>
        </StyledText>
      ),
    },
  ];
};

const CurrentTradingProfit = ({info = {}}) => {
  const {gotoViewFollowSetting, gotoViewTraderProfit, gotoTraderSummaryPage} =
    useClick({traderInfo: info, isHistoryCopyTrader: false});

  const {traderInfoResponse = {}, copyStatus} = info;
  const {_t} = useLang();
  const currentTradingItems = useMemo(
    () => makeCurrentTradingItems(_t, info),
    [_t, info],
  );

  return (
    <Card onPress={gotoTraderSummaryPage}>
      <UserInfoBar userInfo={traderInfoResponse} onPress={gotoViewTraderProfit}>
        <UserInfoBarRightArea
          copyStatus={copyStatus}
          traderInfo={info}
          gotoViewFollowSetting={gotoViewFollowSetting}
        />
      </UserInfoBar>
      <CancelCopyFailHeader
        gotoViewFollowSetting={gotoViewFollowSetting}
        copyStatus={copyStatus}
      />
      <PnlInfo info={info} />
      <Descriptions
        styles={{
          itemStyles: {
            wrap: css`
              margin-bottom: 8px;
            `,
          },
        }}
        items={currentTradingItems}
      />
      <TPSLControlBar
        controlType={TPSLControlType.CopyTrader}
        traderInfo={info}
      />
    </Card>
  );
};

export default memo(CurrentTradingProfit);
