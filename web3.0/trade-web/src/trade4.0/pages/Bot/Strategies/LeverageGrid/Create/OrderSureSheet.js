/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { formatNumber, floatToPercent } from 'Bot/helper';
import _ from 'lodash';
import { useDispatch } from 'dva';
import Row from 'Bot/components/Common/Row';
import { Text } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import { trackClick } from 'src/utils/ga';
import Decimal from 'decimal.js';
import { submitData } from '../config';
import FutureTag from 'Bot/components/Common/FutureTag';
// import { CouponRow } from 'strategies/components/Coupon';


const Layer = ({ dialogRef, options, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { pricePrecision, quotaPrecision, quota, symbolNameText } = options;

  const onConfirm = () => {
    if (loading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'MARGIN_GRID',
      yesOrNo: !!options.coupon,
    });
    setLoading(true);
    dispatch({
      type: 'BotRunning/runMachine',
      payload: submitData(options),
    })
      .then(() => {
        dialogRef.current.toggle();
        onSuccess();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onCancel = () => {
    dialogRef.current.toggle();
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'close',
      resultType: 'MARGIN_GRID',
      yesOrNo: !!options.coupon,
    });
  };
  if (!options?.direction) return null;
  return (
    <DialogRef
      title={_t('gridwidget5')}
      ref={dialogRef}
      okText={_t('gridwidget6')}
      cancelText={null}
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{ loading }}
      size="medium"
    >
      <div className="mb-24">
        <Text as="div" fs={16} color="text">
          {_tHTML('futrgrid.ordersecondsure', {
            amount: formatNumber(options.limitAsset, quotaPrecision),
            quota,
          })}
        </Text>
      </div>

      <Row
        label={_t('share5')}
        value={
          <Text color="text">
            {symbolNameText}
            &nbsp;
            <FutureTag direction={options.direction} leverage={options.leverage} />
          </Text>
        }
      />
      <Row
        label={_t('card13')}
        unit={quota}
        value={`${formatNumber(options.down, pricePrecision)} ~ ${formatNumber(
          options.up,
          pricePrecision,
        )}`}
      />
      <Row label={_t('robotparams10')} unit={_t('unit')} value={options.gridNum} />
      <Row
        label={_t('robotparams6')}
        value={`${floatToPercent(options.gridProfitLowerRatio, 2)} ~ ${floatToPercent(
          options.gridProfitUpperRatio,
          2,
        )}`}
      />
      <Row
        label={_t('futrgrid.expectbaoprice')}
        unit={quota}
        value={formatNumber(options.blowUpPrice, pricePrecision)}
      />

      {!!options.stopLossPrice && (
        <Row
          label={_t('gridform21')}
          unit={quota}
          value={formatNumber(options.stopLossPrice, pricePrecision)}
        />
      )}
      {!!options.stopProfitPrice && (
        <Row
          label={_t('futrgrid.stopprofitprice')}
          unit={quota}
          value={formatNumber(options.stopProfitPrice, pricePrecision)}
        />
      )}
      {!!options.openUnitPrice && (
        <Row
          label={_t('openprice')}
          unit={quota}
          value={formatNumber(options.openUnitPrice, pricePrecision)}
        />
      )}
      {/* 卡券 */}
      {/* <CouponRow coupon={options.coupon} /> */}
    </DialogRef>
  );
};

export default React.memo(Layer);
