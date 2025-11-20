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
import { submitData } from '../config';
import { MIcons } from 'Bot/components/Common/Icon';
import Decimal from 'decimal.js';
// import { CouponRow } from 'strategies/components/Coupon';

const getBaseNum = (options, basePrecision) => {
  return Decimal(options.inverst || 0)
    .div(4)
    .div(options.lastTradedPrice || 1)
    .toFixed(basePrecision, Decimal.ROUND_DOWN);
};
const Layer = ({ dialogRef, setInProp: options, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    symbolInfo: { base, quota, symbolNameText, basePrecision, pricePrecision },
  } = options;

  const onConfirm = () => {
    if (loading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'SPOT_AI_GRID',
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
      resultType: 'SPOT_AI_GRID',
      yesOrNo: !!options.coupon,
    });
  };

  if (_.isEmpty(options)) return null;
  const baseNum = getBaseNum(options, basePrecision);
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
      </div>

      <Row label={_t('share5')} value={symbolNameText} />
      <Row
        label={_t('eGuAzJK7p1ztjs3XD8FqPx')}
        unit={quota}
        value={`${formatNumber(options.min, pricePrecision)}～${formatNumber(
          options.max,
          pricePrecision,
        )}`}
      />
      <Row label={_t('qVHGeEEEKtbkeyp1Y5tmmD')} unit={_t('unit')} value={options.gridNum} />
      <Row label={_t('ceKb5AFY7BnmumCxsKpJ4b')} value={<MIcons.Hook size={16} color="primary" />} />

      {/* 为0不展示 */}
      {baseNum !== 0 && (
        <Alert
          className="mt-20"
          type="info"
          title={_tHTML('clsgrid.transactionhint1', {
            deal: _t('buyin'),
            amount: baseNum,
            base,
          })}
        />
      )}
    </DialogRef>
  );
};

export default React.memo(Layer);
