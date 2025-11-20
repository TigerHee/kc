/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import FutureTag from 'Bot/components/Common/FutureTag';
import Decimal from 'decimal.js';
import { formatNumber, floatText } from 'Bot/helper';
import { Text, Div } from 'Bot/components/Widgets';
import { _t } from 'Bot/utils/lang';

export const SplitBox = styled(Div)`
  display: flex;
  background-color: ${(props) => props.theme.colors.cover2};
  border-radius: 12px;
  padding: 16px 0;
  margin: 16px 0;
`;
export const SplitItem = styled(Div)`
  text-align: center;
  flex: 1;
  padding: 0 10px;
  border-right: 1px solid ${(props) => props.theme.colors.divider4};
  >span, div {
    display: block;
  }
  &:last-child {
    border-right: none;
  }
  ${(props) => props.theme.breakpoints.down(375)} {
    > div {
      font-size: 12px;
    }
  }
`;

const tranArrToMap = (arr) => {
  const obj = {};
  arr.forEach((el) => (obj[el.currency] = el));
  return obj;
};

export const DetailHoldTemp = ({ columns = [], ...rest }) => {
  return (
    <SplitBox {...rest}>
      {columns.map((column, index) => {
        return (
          <SplitItem key={index}>
            <Text color="text60" fs={12} lh="130%">
              {column.label}
            </Text>
            {React.isValidElement(column.value) ? (
              column.value
            ) : (
              <Text fs={16} as="div" lh="130%" color="text">
                {column.value}
              </Text>
            )}
          </SplitItem>
        );
      })}
    </SplitBox>
  );
};

// 现货网格
/**
 * @description:
 * @prop {JSXNode} Append
 * @return {*}
 */
export default ({ symbolInfo, className, currencies, Prepend, Append }) => {
  const currencyMap = tranArrToMap(currencies);
  const { base, quota, cbase, cquota, basePrecision, quotaPrecision } = symbolInfo;
  return (
    <SplitBox className={className}>
      {!!Prepend && <SplitItem>{Prepend}</SplitItem>}
      <SplitItem>
        <Text color="text60" fs={12} lh="130%">
          {base} {_t('openorder7')}
        </Text>
        <Text fs={16} as="div" lh="130%" color="text">
          {formatNumber(currencyMap[cbase]?.totalBalance ?? 0, basePrecision)}
        </Text>
      </SplitItem>
      <SplitItem>
        <Text color="text60" fs={12} lh="130%">
          {quota} {_t('openorder7')}
        </Text>
        <Text fs={16} as="div" lh="130%" color="text">
          {formatNumber(currencyMap[cquota]?.totalBalance ?? 0, quotaPrecision)}
        </Text>
      </SplitItem>
      {!!Append && <SplitItem>{Append}</SplitItem>}
    </SplitBox>
  );
};
