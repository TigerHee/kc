/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import { styled, fx } from '@/style/emotion';
import { Box, Divider } from '@kux/mui';
import AdaptiveDrawer from '@/components/AdaptiveDrawer';
import { useSelector, useDispatch } from 'react-redux';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { equals, dividedBy, multiply, abs } from 'utils/operation';
import { getDigit, moment2Intl } from 'helper';
import { stopReferences } from '@/pages/Orders/FuturesOrders/config';
import { useSymbolCellNeedInfo } from '@/hooks/futures/useGetSymbolText';
import PrettySize from '../../../../components/PrettySize';
import { _t } from 'utils/lang';
import FormatPriceCell from '../../../../components/FormatPriceCell';
import TypeCell from '../../../../components/TypeCell';
import { MARGIN_MODE_CROSS } from 'src/trade4.0/meta/futures';

const DetailContent = styled.div`
  ${fx.padding('24px 32px')}
  ${(props) => props.theme.breakpoints.down('sm')} {
    ${fx.padding('16px')}
  }
`;

const Row = styled.div`
  ${fx.display('flex')}
  ${fx.justifyContent('space-between')}
  ${fx.fontWeight(400)}
  ${fx.fontSize(16)}
  ${fx.lineHeight(21)}
  ${(props) => fx.color(props, 'text60')}
  ${fx.marginBottom(12)}
`;

const Col = styled.div`
  ${fx.width('168', 'px')}
  &.value {
    ${(props) => fx.color(props, 'text')}
    ${fx.wordBreak('break-all')}
    ${fx.flex('1')}
    ${fx.textAlign('right')}
  }
`;

const MuiDivider = styled(Divider)`
  margin: 16px 0;
`;

const OrderHistoryDetailModal = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.futures_orders.orderHistoryVisible);
  const orderHistoryDetail = useSelector((state) => state.futures_orders.orderDetail);

  const {
    symbol,
    type,
    leverage,
    dealSize,
    dealValue,
    stopPrice,
    stopPriceType,
    postOnly,
    visibleSize,
    timeInForce,
    hidden,
    cancelExist,
    remark,
    closeOnly,
    endAt,
    marginMode,
  } = orderHistoryDetail;

  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const marginModeText =
    marginMode === MARGIN_MODE_CROSS ? _t('futures.cross') : _t('futures.isolated');

  const { multiplier, tickSize, isInverse } = contract;

  const showInfo = useMemo(() => {
    const fixed = getDigit(tickSize);
    let dividedValue = abs(dividedBy(dealSize)(multiply(dealValue)(multiplier)));
    if (!isInverse) {
      dividedValue = dividedBy(dealValue)(multiply(dealSize)(multiplier));
    }
    const dealPrice = !equals(dealSize)(0) ? dividedValue : '-';
    const stopPriceTypeText = stopPriceType
      ? _t(stopReferences.find(({ value }) => value === stopPriceType).text)
      : '-';

    return {
      fixed,
      dividedValue,
      dealPrice,
      stopPriceTypeText,
    };
  }, [tickSize, dealSize, dealValue, multiplier, isInverse, stopPriceType]);

  const { symbolTextInfo } = useSymbolCellNeedInfo(symbol);

  const cancelEvent = () => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        orderHistoryVisible: false,
        orderDetail: {},
      },
    });
  };

  return (
    <AdaptiveDrawer
      back={false}
      onClose={cancelEvent}
      width="480px"
      title={_t('assets.OrderHistory.orderDetail')}
      show={visible}
    >
      <DetailContent>
        <Row>
          <Col>{_t('head.contracts')}</Col>
          <Col className="value">
            {symbolTextInfo.name} {symbolTextInfo.type}
          </Col>
        </Row>
        <Row>
          <Col>{_t('futures.marginMode.title')}</Col>
          <Col className="value">{marginModeText}</Col>
        </Row>
        <Row>
          <Col>{_t('refer.OrderType')}</Col>
          <Col className="value">
            <TypeCell {...orderHistoryDetail} showAdvanced={false} />
          </Col>
        </Row>
        <Row>
          <Col>{_t('order.detail.lv')}</Col>
          <Col className="value">{`${leverage}x`}</Col>
        </Row>
        <Row>
          <Col>{_t('order.detail.stopType')}</Col>
          <Col className="value">{showInfo.stopPriceTypeText}</Col>
        </Row>
        <Row>
          <Col>{_t('order.detail.stopPrice')}</Col>
          <Col className="value">
            <FormatPriceCell value={stopPrice} symbol={symbol} type={stopPriceType} />
          </Col>
        </Row>
        <Row>
          <Col>{_t('order.detail.dealPrice')}</Col>
          <Col className="value">
            <FormatPriceCell value={showInfo.dealPrice} symbol={symbol} type="TP" />
          </Col>
        </Row>
        {endAt && (
          <Row type="flex" justify="space-between">
            <Col>{_t('order.endat')}</Col>
            <Col className="value">
              {moment2Intl({ date: endAt, format: 'YYYY/MM/DD HH:mm:ss' })}
            </Col>
          </Row>
        )}
        {cancelExist && remark && (
          <Row type="flex" justify="space-between">
            <Col>{_t('trade.cancel.reason')}</Col>
            <Col className="value">{remark}</Col>
          </Row>
        )}
        <MuiDivider />
        <Row>
          <Col>{_t('order.detail.post')}</Col>
          <Col className="value">{postOnly ? _t('order.detail.e') : _t('order.detail.ne')}</Col>
        </Row>
        <Row>
          <Col>{_t('order.detail.showNum')}</Col>
          <Col className="value">
            {hidden ? <PrettySize symbol={symbol} value={+visibleSize} /> : '-'}
          </Col>
        </Row>
        <Row>
          <Col>{_t('order.detail.time')}</Col>
          <Col className="value">{timeInForce}</Col>
        </Row>
        <Row>
          <Col>{_t('trade.order.reduceOnly')}</Col>
          <Col className="value">{closeOnly ? _t('order.detail.e') : _t('order.detail.ne')}</Col>
        </Row>
      </DetailContent>
    </AdaptiveDrawer>
  );
};

export default memo(OrderHistoryDetailModal);
