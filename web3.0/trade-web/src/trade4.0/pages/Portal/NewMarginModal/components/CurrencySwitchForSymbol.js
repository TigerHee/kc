/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { map, split } from 'lodash';
import styled from '@emotion/styled';
import { useTheme, useResponsive } from '@kux/mui';
import { ICSuccessFilled, ICSuccessUnselectOutlined } from '@kux/icons';
import CoinCodeToName from '@/components/CoinCodeToName';
import CoinIcon from '@/components/CoinIcon';
import { _t } from 'src/utils/lang';

/** 样式开始 */
const Dict = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  /* margin-top: 8px; */
  color: ${({ isLong, theme: { colors } }) =>
    (isLong ? colors.primary : colors.secondary)};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const Currency = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const CurrencyBox = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid
    ${({ isActive, theme: { colors } }) =>
      (isActive ? colors.primary : colors.cover12)};
  background-color: ${({ isActive, theme: { colors } }) =>
    (isActive ? colors.cover4 : 'none')};
  flex: 1;
  &:not(:first-of-type) {
    margin-left: 12px;
  }
  &:hover {
    background-color: ${({ theme: { colors } }) => colors.cover4};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 7px 16px;
  }
`;
const CurrencyList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;
/** 样式结束 */

const CurrencySwitchForSymbol = ({ symbol, showDict, value, onChange }) => {
  const { colors } = useTheme();
  const { sm } = useResponsive();
  const isolatedSymbolsMap = useSelector(
    (state) => state.symbols.isolatedSymbolsMap,
  );
  const [base, quote] = split(symbol, '-');

  const coins = [base, quote].filter((v) => {
    const enabledKey = v === base ? 'baseBorrowEnable' : 'quoteBorrowEnable';
    return isolatedSymbolsMap[symbol]?.[enabledKey];
  });

  return (
    <CurrencyList>
      {map(coins, (item) => {
        const isActive = value === item;
        return (
          <CurrencyBox
            key={item}
            isActive={isActive}
            onClick={() => onChange(item)}
          >
            <div className="flex-center">
              <CoinIcon showName={false} currency={item} size={sm ? 24 : 20} />
              <div className="ml-8">
                <Currency>
                  <CoinCodeToName coin={item} />
                </Currency>
                {Boolean(showDict) && (
                  <Dict isLong={item === quote}>
                    {item === quote ? _t('trade.long') : _t('trade.short')}
                  </Dict>
                )}
              </div>
            </div>
            {isActive ? (
              <ICSuccessFilled size={20} color={colors.primary} />
            ) : (
              <ICSuccessUnselectOutlined size={20} color={colors.icon40} />
            )}
          </CurrencyBox>
        );
      })}
    </CurrencyList>
  );
};

export default CurrencySwitchForSymbol;
