/*
 * owner: borden@kupotech.com
 */
import React, { Fragment, useMemo, useContext } from 'react';
import { useSelector } from 'dva';
import useMarginModel from '@/hooks/useMarginModel';
import CoinPrecision from '@/components/CoinPrecision';
import BorrowingInfoTip from '@/components/Margin/BorrowingInfoTip';
import { _t } from 'src/utils/lang';
import { min, multiply } from 'src/utils/operation';
import useSide from '../../../../hooks/useSide';
import useOrderType from '../../../../hooks/useOrderType';
import useOrderCurrency from '../../../../hooks/useOrderCurrency';
import { Container, Row, Value, FlexWrapper, StyledTooltipWrapper } from './style';
import useMarginOrderModeType from '@/hooks/useMarginOrderModeType';
import { MARGIN_ORDER_MODE_ENUM, WrapperContext } from '@/pages/OrderForm/config';
import { useTradeType } from '@/hooks/common/useTradeType';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';

const { NORMAL, AUTO_BORROW, AUTO_REPAY, AUTO_BORROW_AND_REPAY } = MARGIN_ORDER_MODE_ENUM;

// 当买卖下单模式不一样时，防止底部按钮错位需要设置占位节点
// 每个模式下显示的 节点的数量
const PLACEHOLDER_LENGTH_ENUM = {
  NORMAL: 0,
  AUTO_BORROW: 1,
  AUTO_REPAY: 2,
  AUTO_BORROW_AND_REPAY: 3,
};

const ValueRender = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  return isLogin ? children : '-';
};
/**
 * 杠杆下单模式展示的信息
 * 普通 - none
 * 自动借币 - 借币
 * 自动还币 - 还币，负债
 * 买卖选的模式不一样时需要设置占位节点
 */
const MarginOrderInfo = React.memo(
  ({ borrowingAmount, showBorrowingInfo, price, amount }) => {
    const { side } = useSide();
    const { currency, currencyName } = useOrderCurrency({ side });
    const tradeType = useTradeType();
    const { isMarket } = useOrderType();
    const isBuy = side === 'buy';
    const screen = useContext(WrapperContext);
    const isMd = screen === 'md';

    const {
      marginOrderModeBuy,
      marginOrderModeSell,
      isolatedOrderModeBuy,
      isolatedOrderModeSell,
      currentMarginOrderMode,
    } = useMarginOrderModeType();

    // 本次交易将获得的币种
    const {
      currency: obtainedCurrency,
      currencyName: obtainedCurrencyName,
    } = useOrderCurrency({ side, invert: true });
    const { position } = useMarginModel(['position']);

    const marginOrderModeInfo = useMemo(() => {
      // 如果是聚合在一起的不需要渲染占位节点
      if (!isMd) return {};
      const isCross = tradeType === TRADE_TYPES_CONFIG.MARGIN_TRADE.key;

      const buyLength =
        PLACEHOLDER_LENGTH_ENUM[
          isCross ? marginOrderModeBuy : isolatedOrderModeBuy
        ];
      const sellLength =
        PLACEHOLDER_LENGTH_ENUM[
          isCross ? marginOrderModeSell : isolatedOrderModeSell
        ];
      const diffLength = Math.abs(buyLength - sellLength) || 0;

      // 数据较少的那一方应该渲染占位节点
      const shouldRenderPlaceholderSide =
        buyLength > sellLength ? 'sell' : 'buy';

      return {
        diffLength,
        shouldRenderPlaceholderSide,
      };
    }, [
      side,
      marginOrderModeBuy,
      marginOrderModeSell,
      isolatedOrderModeBuy,
      isolatedOrderModeSell,
      tradeType,
      isMd,
    ]);

    const { liability = 0 } = position[obtainedCurrency] || {};

    /**
     * 计算还币值-只是前端计算的一个大概的值
     * 1. 限价单
     *    买单 取 Math.min(表单数量, 负债)
     *    卖单 取 Math.min(表单成交额, 负债)
     * 2. 市价单
     *    市价 展示 特定文案 '以实际成交为准'
     */
    const repayAmount = useMemo(() => {
      // 市价
      if (isMarket) {
        return _t('gRZxbthPvCbqrYYBH5dLbZ');
      }
      // 买单
      if (isBuy) {
        return Math.min(amount, liability) || 0;
      }
      const volume = multiply(amount)(price);
      // 卖单
      return min(volume, liability).toFixed() || 0;
    }, [isMarket, isBuy, liability, amount, price]);

    if (currentMarginOrderMode === NORMAL && !marginOrderModeInfo.diffLength) return null;
    return (
      <Fragment>
        <Container>
          {/* 自动借币时展示 借币 */}
          {[AUTO_BORROW, AUTO_BORROW_AND_REPAY].includes(currentMarginOrderMode) && (
            <Row>
              <FlexWrapper>
                <StyledTooltipWrapper size="small" isTip useUnderline title={_t('d8Pjhwzz2mmkiqFZkmidth')}>
                  {_t('marginGuide.borrow')}
                </StyledTooltipWrapper>

                {showBorrowingInfo && (
                  <BorrowingInfoTip size={12} currency={currency} />
                )}
              </FlexWrapper>

              <Value>
                <ValueRender>
                  <CoinPrecision coin={currency} value={borrowingAmount} />
                </ValueRender>
                {' '}
                {currencyName}
              </Value>
            </Row>
          )}
          {/* 自动还币时展示 还币/负债*/}
          {[AUTO_REPAY, AUTO_BORROW_AND_REPAY].includes(currentMarginOrderMode) && (
            <Fragment>
              <Row>
                <StyledTooltipWrapper size="small" isTip useUnderline title={_t('fGbWvAsYJa5dGpXXnigvsW')}>
                  {_t('margin.repay')}
                </StyledTooltipWrapper>
                <Value>
                  {isMarket ? (
                    repayAmount
                  ) : (
                    <Fragment>
                      <ValueRender>
                        <CoinPrecision coin={obtainedCurrency} value={repayAmount} />
                      </ValueRender>
                      {' '}
                      {obtainedCurrencyName}
                    </Fragment>
                  )}
                </Value>
              </Row>
              <Row>
                <StyledTooltipWrapper size="small" isTip useUnderline title={_t('1XG8HuzhUjCSdCnptZGu3F')}>
                  {_t('margin.debt.amount')}
                </StyledTooltipWrapper>
                <Value>
                  <ValueRender>
                    <CoinPrecision coin={obtainedCurrency} value={liability} />
                  </ValueRender>
                  {' '}
                  {obtainedCurrencyName}
                </Value>
              </Row>
            </Fragment>
          )}
        </Container>
        {/* 占位节点 */}
        {marginOrderModeInfo.shouldRenderPlaceholderSide === side &&
          !!marginOrderModeInfo.diffLength &&
          Array.from({ length: marginOrderModeInfo.diffLength }, () => (
            <Row style={{ opacity: 0, pointerEvents: 'none' }}>
              <StyledTooltipWrapper size="small" useUnderline>-</StyledTooltipWrapper>
            </Row>
          ))}
      </Fragment>
    );
  },
);

export default MarginOrderInfo;
