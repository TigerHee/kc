/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { _t } from 'Bot/utils/lang';
import { formatNumber } from 'Bot/helper';

const handleSortData = (data) => {
  const buy = [];
  const sell = [];
  data.forEach((el) => {
    if (el.side === 'buy') {
      buy.push(el);
    } else {
      sell.push(el);
    }
  });
  buy.sort((a, b) => +b.price - Number(a.price));
  sell.sort((a, b) => +a.price - Number(b.price));
  return {
    buy,
    sell,
    max: Math.max(buy.length, sell.length),
  };
};
const TTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
  color: ${(props) => props.theme.colors.text60};
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
  tbody > tr:hover {
    background-color: ${(props) => props.theme.colors.cover2};
  }
  tbody {
    td {
      padding: 4px 0;
      font-weight: 500;
    }
  }
`;
const Box = styled.div`
  > span {
    flex-grow: 0;
    flex-shrink: 0;
    width: 50%;
  }
`;
export default React.memo(({ data = [], info: { base, quota, basePrecision, pricePrecision } }) => {
  const { buy, sell, max } = handleSortData(data);
  return (
    <TTable>
      <thead>
        <tr>
          <td className="nowrap">{_t('openorder1')}</td>
          <td className="left">
            {_t('openorder2')}({base})
          </td>
          <td className="center nowrap">
            {_t('openorder3')}({quota})
          </td>
          <td className="right">
            {_t('openorder2')}({base})
          </td>
          <td className="right nowrap">{_t('openorder1')}</td>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: max }).map((el, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={index}>
              <td className="left">{buy.length - 1 >= index ? index + 1 : ''}</td>
              <td className="left">
                {buy.length - 1 >= index ? formatNumber(buy[index].size, basePrecision) : ''}
              </td>
              <td>
                <Box className="Flex">
                  <span className="color-primary right mr-4">
                    {buy.length - 1 >= index ? formatNumber(buy[index].price, pricePrecision) : ''}
                  </span>
                  <span className="color-secondary ml-4">
                    {sell.length - 1 >= index
                      ? formatNumber(sell[index].price, pricePrecision)
                      : ''}
                  </span>
                </Box>
              </td>
              <td className="right">
                {sell.length - 1 >= index ? formatNumber(sell[index].size, basePrecision) : ''}
              </td>
              <td className="right">{sell.length - 1 >= index ? index + 1 : ''}</td>
            </tr>
          );
        })}
      </tbody>
    </TTable>
  );
});
