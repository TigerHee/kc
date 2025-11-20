import React from 'react';
import {View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';

import TipTrigger from 'components/Common/TipTrigger';
import useLang from 'hooks/useLang';
import {
  PnlInfoWrap,
  PnlRowWrap,
  PnlValueRowWrap,
  RowWrap,
  TotalMinPnlPercent,
  TotalPnlValue,
} from '../styles';
import TraderShare from './TraderShare';

const PnlInfo = ({info}) => {
  const {totalPnl, totalPnlRatio} = info;
  const {_t} = useLang();
  return (
    <PnlInfoWrap>
      <PnlRowWrap>
        <RowWrap>
          <TipTrigger
            textStyle={css`
              font-size: 12px;
              line-height: 15.6px;
            `}
            showUnderLine
            showIcon={false}
            text={_t('0d7db9ab15a64000a94e', {symbol: getBaseCurrency()})}
            message={_t('3cb8fc6ffd5a4000aaa5')}
          />
          <View
            style={css`
              margin-left: 4px;
            `}>
            <TraderShare info={info} />
          </View>
        </RowWrap>
      </PnlRowWrap>

      <PnlValueRowWrap>
        <RowWrap>
          <TotalPnlValue isProfitNumber>{totalPnl}</TotalPnlValue>
          <TotalMinPnlPercent beforeText="(" afterText=")">
            {totalPnlRatio}
          </TotalMinPnlPercent>
        </RowWrap>
        {/* <TodayPnlValue isProfitNumber>{todayPnl}</TodayPnlValue> */}
      </PnlValueRowWrap>
    </PnlInfoWrap>
  );
};

export default PnlInfo;
