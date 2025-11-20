/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { formatNumber } from 'Bot/helper';
import _ from 'lodash';
import { useDispatch } from 'dva';
import Row from 'Bot/components/Common/Row';
import { MIcons } from 'Bot/components/Common/Icon';
import { Text, Flex } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import { trackClick } from 'src/utils/ga';
import { submitData, responseAlertJump } from 'AiFutureTrend/config';
// import { CouponRow } from 'strategies/components/Coupon';

const Layer = ({ dialogRef, options, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    symbolInfo: { quota, symbolNameText, quotaPrecision },
  } = options;

  const onConfirm = () => {
    if (loading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'FUTURES_CTA',
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
      resultType: 'FUTURES_CTA',
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
      <Row label={_t('futrgrid.leveragex')} value={`${options.leverage}x`} />
      <Row label={_t('bearmaxback')} value={`${options.pullBack}%`} />
      {options.stopLossPercent && (
        <Row label={_t('lossstop')} value={`${options.stopLossPercent}%`} />
      )}
      {options.stopProfitPercent && (
        <Row label={_t('takeprofit')} value={`${options.stopProfitPercent}%`} />
      )}

      {/* 卡券 */}
      {/* <CouponRow coupon={options.coupon} />
      <GoldCouponRow coupon={options.goldCoupon} /> */}
      <Flex vc onClick={responseAlertJump} cursor>
        <MIcons.InfoLine size={12} color="primary" />
        <Text fs={12} color="primary" ml={2}>
          {_t('responsalert')}
        </Text>
      </Flex>
    </DialogRef>
  );
};

export default React.memo(Layer);
