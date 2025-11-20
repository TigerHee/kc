/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { formatNumber } from 'Bot/helper';
import _ from 'lodash';
import { useDispatch } from 'dva';
import Row from 'Bot/components/Common/Row';
import { Text } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import { trackClick } from 'src/utils/ga';
import Alert from '@mui/Alert';
// import { CouponRow } from 'strategies/components/Coupon';

const Layer = ({ dialogRef, setInProp: { submitData, options }, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    symbolInfo: {
      base,
      quota,
      symbolNameText,
      basePrecision,
      pricePrecision,
    },
  } = options;

  const onConfirm = () => {
    if (loading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'spotGrid',
      yesOrNo: !!options.coupon,
    });
    setLoading(true);
    dispatch({
      type: 'BotRunning/runMachine',
      payload: submitData,
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
      resultType: 'spotGrid',
      yesOrNo: !!options.coupon,
    });
  };

  if (_.isEmpty(options) || _.isEmpty(submitData)) return null;

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
        <Text color="text60" fs={16} lh="130%">
          {_tHTML('clsgrid.ordersecondsure', {
            amount: formatNumber(options.inverst, pricePrecision),
            base,
            quota,
          })}
        </Text>
        {!!options.isUseBase && (
          <Text color="text60" fs={12} as="div" lh="130%">
            {_tHTML('clsgrid.ordersecondsurelayout', {
              base,
              quota,
              baseAmount: formatNumber(options.needInverstBase, basePrecision),
              quotaAmount: formatNumber(options.needInverstQuota, pricePrecision),
            })}
          </Text>
        )}
      </div>

      <Row label={_t('share5')} value={symbolNameText} />
      <Row
        label={_t('card13')}
        unit={quota}
        value={`${formatNumber(options.min, pricePrecision)}～${formatNumber(
          options.max,
          pricePrecision,
        )}`}
      />
      <Row label={_t('robotparams10')} unit={_t('unit')} value={options.placeGrid} />
      <Row label={_t('robotparams6')} value={options.gridProfit} />
      {!!options.stopLossPrice && (
        <Row
          label={_t('gridform21')}
          unit={quota}
          value={formatNumber(options.stopLossPrice, pricePrecision)}
        />
      )}
      {!!options.stopProfitPrice && (
        <Row
          label={_t('stopprofit')}
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

      {/* 为0不展示 */}
      {options.deelBaseNum !== 0 && (
        <Alert
          className="mt-20"
          type="info"
          title={_tHTML(`clsgrid.transactionhint${options.openUnitPrice ? 2 : 1}`, {
            deal: options.deelBaseNum > 0 ? _t('buyin') : _t('sellout'),
            price: formatNumber(options.openUnitPrice, pricePrecision),
            amount: `${formatNumber(Math.abs(options.deelBaseNum), basePrecision) } `,
            base,
            quota,
          })}
        />
      )}
    </DialogRef>
  );
};

export default React.memo(Layer);
