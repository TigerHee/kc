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
import { submitData } from '../config';
// import { CouponRow } from 'strategies/components/Coupon';

const Layer = ({ dialogRef, setInProp: options, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    symbolInfo: { quota, symbolNameText, quotaPrecision },
  } = options;

  const onConfirm = () => {
    if (loading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'CTA',
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
      resultType: 'CTA',
      yesOrNo: !!options.coupon,
    });
  };

  if (_.isEmpty(options)) return null;
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
          {_tHTML('futrgrid.ordersecondsure', {
            amount: formatNumber(options.limitAsset, quotaPrecision),
            quota,
          })}
        </Text>
      </div>

      <Row label={_t('share5')} value={symbolNameText} />
    </DialogRef>
  );
};

export default React.memo(Layer);
