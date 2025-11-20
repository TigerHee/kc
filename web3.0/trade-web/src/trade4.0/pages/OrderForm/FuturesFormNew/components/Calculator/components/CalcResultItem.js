/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { greaterThanOrEqualTo, styled, thousandPointed } from '../../../builtinCommon';
import { CoinCurrency } from '../../../builtinComponents';

import { getExactNum } from '../utils';

const ListBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;

  .listTitle {
    font-size: 14px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};
  }
  .pretty-currency {
    font-size: 12px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};
  }
  .listValueBox {
    text-align: right;
  }
`;

const ListValue = styled.div`
  margin-bottom: 2px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  color: ${(props) => props.theme.colors.text40};
  .value {
    color: ${(props) => {
      return props.colorSpec
        ? props.isLong
          ? props.theme.colors.primary
          : props.theme.colors.secondary
        : props.theme.colors.text;
    }};
  }
  /* .unit {
    margin-left: 4px;
  } */
`;

const CoinCurrencyWrapper = styled(CoinCurrency)`
  font-size: 12px;
  line-height: 1.3;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
`;

const CalcResultItem = ({ name, value, unit, unitKey, symbolInfo, fixed, colorSpec }) => {
  return (
    <ListBox className="calculator-item">
      <div className="listTitle">{name}</div>
      <div className="listValueBox">
        <ListValue colorSpec={colorSpec && value != null} isLong={greaterThanOrEqualTo(value)(0)}>
          {value == null ? (
            <span>{'--'}</span>
          ) : (
            <span className="value">{thousandPointed(getExactNum(value, fixed))}</span>
          )}
          <span className="unit">{` ${unit || symbolInfo?.[unitKey]}`}</span>
        </ListValue>
        {unitKey ? (
          <CoinCurrencyWrapper value={value} coin={symbolInfo?.[unitKey]} defaultValue="--" />
        ) : null}
      </div>
    </ListBox>
  );
};

export default React.memo(CalcResultItem);
