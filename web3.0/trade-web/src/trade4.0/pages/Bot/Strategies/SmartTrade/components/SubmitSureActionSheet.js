/**
 * Owner: mike.hu@kupotech.com
 */
import React from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import Row from 'Bot/components/Common/Row';
import AdjustChange from 'SmartTrade/components/AdjustChange';
import { getLimitTextByMethod } from 'SmartTrade/config';
// import { CouponRow } from 'strategies/components/Coupon';
import _ from 'lodash';
import { Divider } from '@kux/mui';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';

/**
 * @description: 用于所有二次确认弹窗
 * @return {*}
 */
const Layer = ({
  title,
  desc,
  options,
  confirmLoading,
  onConfirm,
  onCancel,
  dialogRef,
  append,
  coupon,
}) => {
  title = title ?? _t('gridwidget5');
  const onCancelJack = () => {
    onCancel && onCancel();
    dialogRef.current.toggle();
  };
  // lossProfit 可选
  const { method, change, lossProfit } = options;
  return (
    <DialogRef
      title={title}
      ref={dialogRef}
      okText={_t('gridwidget6')}
      cancelText={null}
      onOk={onConfirm}
      onCancel={onCancelJack}
      okButtonProps={{ loading: confirmLoading }}
      size="medium"
      className="fs-14"
      maskClosable
    >
      <Text as="div" className="lh-22 pb-12 mb-12" color="text">
        {desc}
      </Text>
      <AdjustChange change={change} />
      <Divider />
      {/* 调仓阈值 */}
      {!_.isEmpty(method) && <Row label={_t('autoajust')} value={getLimitTextByMethod(method)} />}
      {/* 止损 */}
      {!!lossProfit?.stopLoss && (
        <Row
          label={_t('zhishunbyratio')}
          value={
            <Text color="text">
              <span>-{lossProfit.stopLoss}%</span>
              <Text color={lossProfit.isSellOnStopLoss ? 'text60' : 'complementary'}>
                ({_t(lossProfit.isSellOnStopLoss ? 'autosell' : 'onlynotice')})
              </Text>
            </Text>
          }
        />
      )}
      {/* 止盈 */}
      {!!lossProfit?.stopProfit && (
        <Row
          label={_t('zhiyinngbyratio')}
          value={
            <Text color="text">
              <span>+{lossProfit.stopProfit}%</span>
              <Text color={lossProfit.isSellOnStopProfit ? 'text60' : 'complementary'}>
                ({_t(lossProfit.isSellOnStopProfit ? 'autosell' : 'onlynotice')})
              </Text>
            </Text>
          }
        />
      )}
      {/* 卡券 */}
      {/* <CouponRow coupon={coupon} /> */}
      {!!append && append}
    </DialogRef>
  );
};

export default React.memo(Layer);
