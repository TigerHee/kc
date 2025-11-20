/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { getCurrencyName } from 'Bot/hooks/useSpotSymbolInfo';
import { formatNumber, floatText } from 'Bot/helper';
import styled from '@emotion/styled';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Flex } from 'Bot/components/Widgets';
/**
 * @description: 用于含有触发开单价（hasEntryPrice），订单详情（typeOfOrderList）
 * @return {*}
 */
export const Table = styled.div`
  font-size: 14px;
  .table-row {
    > span:first-child {
      flex: 0 0 15%;
    }
    ${({ hasEntryPrice }) => {
      if (hasEntryPrice) {
        return `> span:nth-child(2) {
        flex: 0 0 20%;
      }
      > span:nth-child(3) {
        flex: 0 0 20%;
      }
      > span:nth-child(4) {
        flex: 0 0 30%;
        text-align: unset;

      }
      > span:last-child {
      flex: 0 0 15%;
      text-align: right;
    }
      `;
      }

      return ` > span:nth-child(2) {
        flex: 0 0 20%;
        padding-right: 4px;
      }
      > span:nth-child(3) {
        flex: 0 0 50%;
      }
      > span:last-child {
      flex: 0 0 15%;
      text-align: right;
    }
      `;
    }}
  }
  .sellbuy-sec {
    width: 50%;
    &:last-child {
      padding-left: 4px;
    }
    i {
      display: inline-block;
      height: 8px;
    }
  }
`;
export const PrimaryBar = styled.i`
  background-color: ${({ theme }) => theme.colors.primary};
  ${({ changer }) => (changer > 0 ? 'min-width: 1px' : '')};
  width: ${({ changer }) => (changer > 0 ? `${Math.abs(changer)}%` : 0)};
`;

export const SecondaryBar = styled.i`
  background-color: ${({ theme }) => theme.colors.secondary};
  ${({ changer }) => (changer < 0 ? 'min-width: 1px' : '')};
  width: ${({ changer }) => (changer < 0 ? `${Math.abs(changer)}%` : 0)};
`;

/**
 * @description:
 * @param {Boolean} hasEntryPrice
 * @return {*}
 */
export const TableHD = ({ hasEntryPrice, className }) => {
  return (
    <Flex as="div" sb color="text60" mb={8} lh="130%" className={`table-hd table-row ${className}`}>
      <span>{_t('smart.coin')}</span>
      {hasEntryPrice && <span>{_t('openprice')}</span>}
      <span>{_t('smart.adjustbefore')}</span>
      <Flex as="span">
        <span className="sellbuy-sec right">{_t('smart.sellout')}</span>
        <span className="sellbuy-sec">{_t('smart.buyin')}</span>
      </Flex>
      <span>{_t('smart.adjustafter')}</span>
    </Flex>
  );
};
/**
 * @description:
 * @param {Array} change
 * @param {Boolean} hasEntryPrice
 * @return {*}
 */
export const TableBD = ({ change, hasEntryPrice, className }) => {
  return (
    <div className={className}>
      {change.map((el) => (
        <Flex sb color="text" key={el.base} mb={4} as="div" className="table-bd table-row lh-22">
          <span>{getCurrencyName(el.base)}</span>
          {hasEntryPrice && <span>{el.triggerPrice ? formatNumber(el.triggerPrice) : '--'}</span>}
          <span>{floatText(el.before)}</span>
          <Flex as="span" hc={el.changer === 0}>
            {el.changer === 0 ? (
              <div className="center">--</div>
            ) : (
              <>
                <span className="sellbuy-sec right">
                  <SecondaryBar changer={el.changer} />
                </span>
                <span className="sellbuy-sec">
                  <PrimaryBar changer={el.changer} />
                </span>
              </>
            )}
          </Flex>
          <span>{floatText(el.after)}</span>
        </Flex>
      ))}
    </div>
  );
};

/**
 * @description: 在成交订单中使用, normal 在创建页面提交订单使用（创建页面才有triggerPrice字段）
 * @param {Enum} type {normal, typeOfOrderList: 订单详情}
 * @param {*} change
 * @return {*}
 */
export default ({ type = 'normal', Append, change = [] }) => {
  const hasEntryPrice = change?.some((row) => Number(row.triggerPrice) > 0);
  return (
    <Table hasEntryPrice={hasEntryPrice}>
      <TableHD hasEntryPrice={hasEntryPrice} />
      <TableBD change={change} hasEntryPrice={hasEntryPrice} Append={Append} />
    </Table>
  );
};
