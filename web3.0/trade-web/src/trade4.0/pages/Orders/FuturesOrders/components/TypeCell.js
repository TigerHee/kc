/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useMemo } from 'react';

import clsx from 'clsx';
import { _t } from 'utils/lang';

import Text from '@/components/Text';
import { orderVars } from '@/pages/Orders/FuturesOrders/config';
import { fx, styled } from '@/style/emotion';

const TypeCellWrapper = styled.div`
  ${(props) =>
    fx.color(props, props.side == null ? 'unset' : props.side === 'sell' ? 'secondary' : 'primary')}
  padding-right: 4px;
  &.advancedType {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: help;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${(props) => {
    const { isMobile, showOrderType } = props;
    const isColumn = !isMobile && showOrderType;
    // 只处理stop active
    if (isColumn) {
      return `flex-flow: column;`;
    }
  }}
`;

const AdvancedBox = styled.div`
  ${(props) => fx.color(props, 'disable')}
  >span {
    padding: ${(props) => (props.isMobile ? '0 4px' : 'unset')};
    background-color: ${(props) => (props.isMobile ? props.theme.colors.layer : 'unset')};
    border-radius: ${(props) => (props.isMobile ? '4px' : 'unset')};
  }
  .divider {
    margin: 0 2px;
    padding: 0;
  }
  &.advancedType {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: help;
  }
`;

const TypeCell = ({
  displayType,
  side,
  showOrderType = 'order',
  postOnly,
  closeOnly,
  timeInForce,
  isMobile,
  fromReduce,
  hidden,
  iceberg,
  showAdvanced = true, // 是否显示高级订单类型
  advancedDisplayType,
}) => {
  const isNotGTC = timeInForce && timeInForce !== 'GTC';

  const advancedText = useMemo(() => {
    if (fromReduce) {
      return displayType === 'market' ? _t('confirm.market.btn') : _t('position.close.order');
    }
    if (postOnly || isNotGTC) {
      return _t('advanced.limit');
    }
    if (hidden || iceberg) {
      return _t('futures.hidden.order');
    }
    return _t(orderVars[displayType] || 'limit');
  }, [displayType, fromReduce, hidden, iceberg, isNotGTC, postOnly]);

  // 是否存在高级订单类型
  const isExistAdvanced = useMemo(() => {
    return showAdvanced && !isMobile && (closeOnly || postOnly || isNotGTC);
  }, [closeOnly, isMobile, isNotGTC, postOnly, showAdvanced]);

  const renderText = useMemo(() => {
    return (
      <>
        <TypeCellWrapper
          side={side}
          className={clsx('order-type-base', { advancedType: isExistAdvanced })}
        >
          {side ? (
            <>
              {side === 'sell' ? _t('trade.short') : _t('trade.long')}
              <span>/</span>
            </>
          ) : null}
          <span>{advancedDisplayType || advancedText}</span>
        </TypeCellWrapper>
        {showAdvanced ? (
          <AdvancedBox isMobile={isMobile} className={clsx({ advancedType: isExistAdvanced })}>
            {closeOnly ? <span>{_t('trade.order.reduceOnly')}</span> : null}
            {postOnly && closeOnly ? <span className="divider">{isMobile ? '' : '|'}</span> : null}
            {postOnly ? <span>{_t('trade.order.postOnly')}</span> : null}
            {closeOnly && isNotGTC ? <span className="divider">{isMobile ? '' : '|'}</span> : null}
            {isNotGTC ? <span>{timeInForce}</span> : null}
          </AdvancedBox>
        ) : null}
      </>
    );
  }, [
    advancedDisplayType,
    advancedText,
    closeOnly,
    isExistAdvanced,
    isMobile,
    isNotGTC,
    postOnly,
    showAdvanced,
    side,
    timeInForce,
  ]);

  return (
    <Wrapper
      className={`futures-order-type ${isMobile ? 'marginL' : ''}`}
      isMobile={isMobile}
      showOrderType={showOrderType}
    >
      {isExistAdvanced ? (
        <Text cursor="pointer" placement="top" tips={renderText} underline={false}>
          {renderText}
        </Text>
      ) : (
        renderText
      )}
    </Wrapper>
  );
};

export default React.memo(TypeCell);
