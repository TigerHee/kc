/**
 * Owner: roger@kupotech.com
 */

/**
 * 将交易对code转换为展示用的name
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@kux/mui';
import { PREFIX } from '../../common/constants';
import CoinIcon from '../CoinIcon';

const BaseCurrencyWrapper = styled.span`
  font-weight: 500;
  font-size: 15px;
  color: ${(props) => props.theme.colors.text};
`;
const QuoteCurrencyWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.colors.text40};
  flex-shrink: 0;
  margin-left: 2px;
  [dir='rtl'] & {
    margin-left: unset;
    margin-right: 2px;
  }
`;

export const namespace = `${PREFIX}_header`;

const SymbolCodeToName = ({ code = '', noIcon, divide = '/', icon }) => {
  const baseCurrency = code?.split('-')?.[0];
  const quoteCurrency = code?.split('-')?.[1];
  const coinsCategorys = useSelector((state) => state[namespace]?.coinsCategorys);
  return (
    <>
      {noIcon ? null : <CoinIcon icon={icon} coin={baseCurrency} />}
      <span>
        <BaseCurrencyWrapper>
          {coinsCategorys?.[baseCurrency]?.currencyName || baseCurrency}
        </BaseCurrencyWrapper>
        <QuoteCurrencyWrapper>{`${divide}${coinsCategorys?.[quoteCurrency]?.currencyName ||
          quoteCurrency}`}</QuoteCurrencyWrapper>
      </span>
    </>
  );
};

export default SymbolCodeToName;
