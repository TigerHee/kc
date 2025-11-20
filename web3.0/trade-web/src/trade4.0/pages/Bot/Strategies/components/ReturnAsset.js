/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Rebate } from 'Bot/Strategies/components/Coupon';
import { formatNumber, numberFixed } from 'Bot/helper';
import { getCurrencyInfo } from 'Bot/hooks/useSpotSymbolInfo';
import { styled } from '@/style/emotion';

const Span = styled.span`
  em,
  i {
    font-style: normal;
  }
`;
export default React.memo(({ transferDetails, coupon }) => {
  if (!transferDetails?.length) {
    return null;
  }
  const realShow = [];
  // 正常退回
  if (Array.isArray(transferDetails)) {
    transferDetails.forEach((coin) => {
      const { currencyName, precision } = getCurrencyInfo(coin.currency);
      if (+coin.size > 0 && +numberFixed(coin.size, precision) > 0) {
        realShow.push(
          <Span key={coin.currency} className="vm">
            <em className="unit">{formatNumber(coin.size, precision)}</em>
            <i className="unit"> {currencyName}</i>
          </Span>,
          '、',
        );
      }
    });
  }

  // 卡券退回
  if (coupon) {
    realShow.push(<Rebate coupon={coupon} />);
  } else {
    // 去掉最后的'、'
    realShow.pop();
  }

  return realShow;
});
