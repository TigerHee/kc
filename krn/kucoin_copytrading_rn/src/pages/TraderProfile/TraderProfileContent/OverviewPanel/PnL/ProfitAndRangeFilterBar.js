import React from 'react';
import {getBaseCurrency} from 'site/tenant';

import {Number, Percent} from 'components/Common/UpOrDownNumber';
import {BetweenWrap} from 'constants/styles';
import DatePicker from '../components/DatePicker';
import {ShowPnlSwitchType} from '../constant';
import {PnlCard, UpOrDownProfitText} from './styles';

const ProfitAndRangeFilterBar = ({
  period,
  onChangePeriod,
  showType,
  latestPnlInfo,
}) => {
  const {pnl, ratio} = latestPnlInfo || {};

  const isProfit = showType === ShowPnlSwitchType.profit;
  return (
    <PnlCard>
      <BetweenWrap>
        <UpOrDownProfitText>
          {isProfit ? (
            <Number
              style={{fontWeight: '600'}}
              isProfitNumber
              afterText={` ${getBaseCurrency()}`}>
              {pnl}
            </Number>
          ) : (
            <Percent style={{fontWeight: '600'}}>{ratio}</Percent>
          )}
        </UpOrDownProfitText>
        <DatePicker value={period} onChange={onChangePeriod} />
      </BetweenWrap>
    </PnlCard>
  );
};

export default ProfitAndRangeFilterBar;
