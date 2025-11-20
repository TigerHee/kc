/**
 * Owner: willen@kupotech.com
 */
import CoinCodeToName from 'components/common/CoinCodeToName';
import { toPercent } from 'helper';
import React from 'react';
import CurrencyBox from '../MarketList/CurrencyBox';
import { currencyCss, currencyValueCss, DebtRatio } from './styled';

export function LiabilityRate({ liabilityRate: v }) {
  const liabilityRate = +v;
  // 获取不同区段负债率的字体颜色
  const getLiabilityRateColor = () => {
    if (liabilityRate < 0) return 'inherit';
    if (liabilityRate >= 0 && liabilityRate <= 0.6) {
      return '#1ABB97';
    }
    if (liabilityRate > 0.6 && liabilityRate < 0.85) {
      return '#EDB66E';
    }
    if (liabilityRate >= 0.85) {
      return '#ED6666';
    }
    return '#ED6666';
  };
  return (
    <DebtRatio style={{ color: getLiabilityRateColor(liabilityRate) }}>
      {liabilityRate <= 1 ? toPercent(liabilityRate) : '--'}
    </DebtRatio>
  );
}

export function InfoItem({ title, currency, value, item, isLogin, action = null, ...otherProps }) {
  return (
    <InfoItem {...otherProps}>
      <span className="label">{title}:</span>
      {!isLogin || (!item && value === undefined) ? (
        <React.Fragment>
          {` -- `}
          <CoinCodeToName coin={currency} />
        </React.Fragment>
      ) : (
        item || (
          <CurrencyBox
            showLegal
            currency={currency}
            value={value}
            css={currencyCss}
            currencyValueClassName={currencyValueCss}
          />
        )
      )}
      {isLogin ? action : null}
    </InfoItem>
  );
}
