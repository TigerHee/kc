/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import Row from 'Bot/components/Common/Row';
// import { CouponRow } from 'Bot/components/Coupon';
import _ from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { submitData, INVERSTCYCLEMAPS } from '../config';
import styled from '@emotion/styled';
import { formatDayOfWeek, isSelectWeek, formatFirstTimeInvest } from '../util';
import { trackClick } from 'src/utils/ga';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatNumber, floatText } from 'Bot/helper';
import { Text } from 'Bot/components/Widgets';

const Layer = ({ dialogRef, allFormData, onSuccess }) => {
  const isLoading = useSelector((state) => state.loading.effects['BotRunning.runMachine']);
  const dispatch = useDispatch();
  const {
    symbolInfo: { quota, symbolNameText },
    ...formData
  } = allFormData;

  const onConfirm = async () => {
    if (isLoading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'DCA',
      yesOrNo: !!formData.coupon,
    });
    try {
      await dispatch({
        type: 'BotRunning/runMachine',
        payload: submitData(formData),
      });
      dialogRef.current.toggle();
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    dialogRef.current.toggle();
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'close',
      resultType: 'DCA',
      yesOrNo: !!formData.coupon,
    });
  };
  const intervalText = INVERSTCYCLEMAPS().get(formData.interval[0]);
  return (
    <DialogRef
      title={_t('gridwidget5')}
      ref={dialogRef}
      okText={_t('gridwidget6')}
      cancelText={null}
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{ loading: isLoading, fullWidth: true }}
      size="medium"
    >
      <div className="pb-12 mb-8 mt-6">
        <Text>
          {_t('firsttimeinvest')}: {formatFirstTimeInvest(formData)}
        </Text>
      </div>
      <Row label={_t('auto.autocoin')} value={symbolNameText} />
      <Row label={_t('auto.perhowmuch')} unit={quota} value={formatNumber(formData.amount)} />
      {!!formData.maxTotalCost && (
        <Row
          label={_t('auto.inverstuplimit')}
          unit={quota}
          value={formatNumber(formData.maxTotalCost)}
        />
      )}

      <Row label={_tHTML('auto.whentoinverst2')} value={intervalText} />
      {isSelectWeek(formData.interval) && (
        <Row label={_t('dayofweektoinvest')} value={formatDayOfWeek(formData.dayOfWeek)} />
      )}
      <Row label={_t('auto.firstordertime')} value={formatFirstTimeInvest(formData)} />
      <Row label={_t('auto.profittarget')} value={floatText(formData.profitTarget)} />

      {/* 卡券 */}
      {/* <CouponRow coupon={formData.coupon} /> */}
    </DialogRef>
  );
};

export default React.memo(Layer);
