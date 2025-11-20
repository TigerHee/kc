/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import SideTag, { MarketType } from 'Bot/components/Common/SideTag';
import DialogRef from 'Bot/components/Common/DialogRef';
import Popover from 'Bot/components/Common/Popover';
import { MIcons } from 'Bot/components/Common/Icon';
import { Text, Flex } from 'Bot/components/Widgets';
import {
  localDateTimeFormat,
  formatNumber,
  formatEffectiveDecimal,
  isFutureSymbol,
} from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { useMediaQuery } from '@kux/mui/hooks';
import { CardRow } from './OrderList';

const PCGrid = ({ label = '', value = '', unit, className, valueClass = 'text' }) => {
  return (
    <div className={`flex1 fs-12 lh-26 pr-4 ${className}`}>
      <Text as="div" color="text60" className="lh-20">
        {label}
        <br />
        {unit}
      </Text>
      <Text color={valueClass}>{value}</Text>
    </div>
  );
};
const Grid = (props) => {
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  if (isH5) {
    return <CardRow {...props} />;
  }
  return <PCGrid {...props} />;
};

const SecondaryDiv = styled.div`
  border-radius: 12px;
  padding: 20px 16px;
  min-height: 176px;
  background-color: ${(props) => props.theme.colors.secondary8};
`;

const PrimaryDiv = styled.div`
  min-height: 176px;
  border-radius: 12px;
  padding: 20px 16px;
  background-color: ${(props) => props.theme.colors.primary4};
`;

const Box = styled.div`
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
    flex-wrap: wrap;
  }
`;
/**
 * @description: 现货
 * @return {*}
 */
const formatSpotFieldsFunc = ({ order, symbolInfo }) => {
  return [
    {
      label: _t('stoporders4'),
      value: formatNumber(order.size, symbolInfo.basePrecision),
      unit: symbolInfo.base,
    },
    {
      label: _t('clsgrid.dealednum'),
      value: formatNumber(order.dealSize, symbolInfo.basePrecision),
      unit: symbolInfo.base,
    },
    {
      label: _t('stoporders6'),
      value: order.pprice,
      unit: symbolInfo.quota,
    },
    {
      label: _t('clsgrid.dealede'),
      value: formatNumber(order.dealFunds, symbolInfo.quotaPrecision),
      unit: symbolInfo.quota,
    },
    {
      label: _t('fee'),
      value: formatEffectiveDecimal(order.fee, 12),
      unit: symbolInfo.quota,
    },
  ];
};
/**
 * @description: 合约
 * @return {*}
 */
const formatFutureFieldsFunc = ({ order, symbolInfo }) => {
  return [
    {
      label: _t('clsgrid.dealednum'),
      value: formatNumber(order.dealSize),
      unit: _t('futrgrid.zhang'),
    },
    {
      label: _t('stoporders6'),
      value: formatNumber(order.price),
      unit: symbolInfo.quota,
    },
    {
      label: _t('clsgrid.dealede'),
      value: formatNumber(order.dealValue),
      unit: symbolInfo.quota,
    },
    {
      label: _t('fee'),
      value: formatEffectiveDecimal(order.fee, 12),
      unit: symbolInfo.quota,
    },
  ];
};

const formatFields = ({ order, symbolInfo }) => {
  return isFutureSymbol(symbolInfo.symbolCode)
    ? formatFutureFieldsFunc({ order, symbolInfo })
    : formatSpotFieldsFunc({ order, symbolInfo });
};
/**
 * @description: 现货类通用
 * @param {*} order
 * @param {*} buy
 * @param {*} symbolInfo
 * @param {*} isShowMatcher
 * @return {*}
 */
export const SpotDetail = ({ order, buy, symbolInfo, isShowMatcher, isShowFeePopover = true }) => {
  const { symbolNameText } = symbolInfo;
  const topFields = formatFields({ order, symbolInfo });
  const bottomFields = formatFields({ order: buy, symbolInfo });

  return (
    <div>
      <SecondaryDiv>
        <div className="Flex vc sb">
          <Flex vc lh="26px">
            <Text fs={20} fw={600} color="text" mr={4}>
              {symbolNameText}
            </Text>

            <SideTag side={order.side} />

            {order.remark && <MarketType>{_t('clsgrid.initialorder')}</MarketType>}
          </Flex>
          {isShowFeePopover ? (
            <Popover placement="top-end" title={_t('tip.feeshaveBeenDeducted')}>
              <span className="Flex vc">
                <Text color="text60" className="fs-16 cursor-pointer mr-6">
                  {_t('card8')}
                </Text>
                <MIcons.InfoLine color="icon" size={16} />
              </span>
            </Popover>
          ) : (
            <Text color="text60" className="fs-16 cursor-pointer mr-6">
              {_t('card8')}
            </Text>
          )}
        </div>

        <div className="Flex vc sb lh-30 mb-14">
          <Text className="fs-14" color="text60">
            {localDateTimeFormat(order.completionAt)}
          </Text>
          {React.isValidElement(order.profit) ? (
            order.profit
          ) : (
            <span className="color-primary">
              {formatEffectiveDecimal(order.profit, symbolInfo.quotaPrecision)}
            </span>
          )}
        </div>

        <Box>
          {topFields.map((field, index) => {
            const lastOne = index + 1 === topFields.length;
            return (
              <Grid
                key={index}
                label={field.label}
                unit={field.unit}
                value={field.value}
                className={lastOne ? 'right' : ''}
                valueClass={lastOne ? 'text60' : ''}
              />
            );
          })}
          {/* <Grid
            label={_t('stoporders4')}
            unit={base}
            value={formatNumber(order.size, symbolInfo.basePrecision)}
          />
          <Grid
            label={_t('clsgrid.dealednum')}
            unit={base}
            value={formatNumber(order.dealSize, symbolInfo.basePrecision)}
          />
          <Grid
            label={_t('stoporders6')}
            unit={quota}
            value={order.pprice}
          />
          <Grid
            label={_t('clsgrid.dealede')}
            unit={quota}
            value={formatNumber(order.dealFunds, symbolInfo.quotaPrecision)}
          />
          <Grid
            label={_t('fee')}
            unit={quota}
            value={formatEffectiveDecimal(order.fee, 12)}
            className="right"
            valueClass="text60"
          /> */}
        </Box>
      </SecondaryDiv>

      {isShowMatcher && (
        <div className="mt-16">
          <Text color="text40" fw={500} as="div" fs={14} >
            {_t('clsgrid.matchbuy')}
          </Text>

          <PrimaryDiv className="mt-16">
            {buy.isLoaded !== false && (
              <>
                <div className="mb-14">
                  <Flex vc lh="26px">
                    <Text fs={20} fw={600} color="text" mr={4}>
                      {symbolNameText}
                    </Text>
                    {buy.side === 'buy' && <SideTag side={buy.side} />}
                    {buy.type === 'limit' && <MarketType type={buy.type} />}
                  </Flex>
                  <Text color="text60" className="lh-30 mb-14 fs-14">
                    {localDateTimeFormat(buy.completionAt)}
                  </Text>
                </div>

                <Box>
                  {bottomFields.map((field, index) => {
                    const lastOne = index + 1 === bottomFields.length;
                    return (
                      <Grid
                        key={index}
                        label={field.label}
                        unit={field.unit}
                        value={field.value}
                        className={lastOne ? 'right' : ''}
                        valueClass={lastOne ? 'text60' : ''}
                      />
                    );
                  })}
                  {/* <Grid
                    label={_t('stoporders4')}
                    unit={base}
                    value={formatNumber(buy.size, symbolInfo.basePrecision)}
                  />
                  <Grid
                    label={_t('clsgrid.dealednum')}
                    unit={base}
                    value={formatNumber(buy.dealSize, symbolInfo.basePrecision)}
                  />
                  <Grid
                    label={_t('stoporders6')}
                    unit={quota}
                    value={buy.pprice}
                  />
                  <Grid
                    label={_t('clsgrid.dealede')}
                    unit={quota}
                    value={formatNumber(buy.dealFunds, symbolInfo.quotaPrecision)}
                  />
                  <Grid
                    label={_t('fee')}
                    unit={quota}
                    value={formatEffectiveDecimal(buy.fee, 12)}
                    className="right"
                    valueClass="text60"
                  /> */}
                </Box>
              </>
            )}
          </PrimaryDiv>
        </div>
      )}
    </div>
  );
};
export const DialogRefWrapper = ({ dialogRef, children }) => {
  return (
    <DialogRef
      cancelText={null}
      okText={null}
      onCancel={() => dialogRef.current.toggle()}
      ref={dialogRef}
      title={_t('card16')}
      size="large"
      maskClosable
    >
      {children}
    </DialogRef>
  );
};
