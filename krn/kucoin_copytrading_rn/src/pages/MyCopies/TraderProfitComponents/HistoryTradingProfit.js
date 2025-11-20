import React, {memo, useMemo} from 'react';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';

import Card from 'components/Common/Card';
import Descriptions from 'components/Common/Descriptions';
import NumberFormat from 'components/Common/NumberFormat';
import Percent from 'components/Common/Percent';
import {Number} from 'components/Common/UpOrDownNumber';
import {UserInfoBar} from 'components/copyTradeComponents/UserInfo';
import {TRADER_ACTIVE_STATUS} from 'constants/businessType';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
// import UserInfoBar from '../UserInfo/UserInfoBar';
import {ShortDateTimeFormat} from './components/ShortDateTimeFormat';
import TraderShare from './components/TraderShare';
import {useClick} from './hooks/useClick';
import {HistoryCopyBtn, StyledText} from './styles';

const makeHistoryTradingItems = (_t, info) => {
  const {copyAmount, totalPnl, profitSharingRatio, startDate, endDate} = info;
  return [
    {
      label: _t('a7ebda625dd24000a1a8', {symbol: getBaseCurrency()}),
      key: 'Total Profit',
      children: (
        <RowWrap>
          <StyledText>
            <Number
              style={css`
                font-weight: 500;
              `}
              isProfitNumber>
              {totalPnl}
            </Number>
          </StyledText>
          <TraderShare info={info} />
        </RowWrap>
      ),
    },
    {
      label: _t('6a045433504b4000aef2', {symbol: getBaseCurrency()}),
      key: 'Current investment',
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
          ~
          <ShortDateTimeFormat
            style={css`
              font-weight: 500;
            `}>
            {endDate}
          </ShortDateTimeFormat>
        </StyledText>
      ),
    },
  ];
};

const HistoryPositionInfo = ({info}) => {
  const {traderInfoResponse, copying} = info;
  const {status} = traderInfoResponse || {};
  const {_t} = useLang();
  const {onClickTrackInMainMyCopyPage} = useTracker();
  const historyTradingItems = useMemo(
    () => makeHistoryTradingItems(_t, info),
    [_t, info],
  );
  const {gotoViewTraderProfit, gotoTraderSummaryPage} = useClick({
    traderInfo: info,
    isHistoryCopyTrader: true,
  });
  const onViewProfit = () => {
    onClickTrackInMainMyCopyPage({
      blockId: 'myTrader',
      locationId: 'copyAgain',
    });
    gotoViewTraderProfit('NO_TRACK');
  };
  return (
    <Card onPress={gotoTraderSummaryPage}>
      <UserInfoBar userInfo={traderInfoResponse} onPress={onViewProfit}>
        {!copying && status === TRADER_ACTIVE_STATUS.Available && (
          <HistoryCopyBtn onPress={onViewProfit} type="secondary" size="mini">
            {_t('23a0786bbca74000a2eb')}
          </HistoryCopyBtn>
        )}
        {/* <Circle
          style={css`
            margin-left: 12px;
          `}
          onPress={gotoTraderSummaryPage}>
          <TraderCardRightArrowIcon />
        </Circle> */}
      </UserInfoBar>

      <Descriptions
        styles={{
          card: css`
            margin-top: 16px;
          `,
          itemStyles: {
            wrap: css`
              margin-bottom: 8px;
            `,
          },
        }}
        items={historyTradingItems}
      />
    </Card>
  );
};

export default memo(HistoryPositionInfo);
