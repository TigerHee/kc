/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, useSnackbar } from '@kux/mui';
import AdaptiveModal from '@/components/AdaptiveModal';
import { styled } from '@kux/mui/emotion';
import { _t, _tHTML } from 'utils/lang';
import { CONFIRM_CONFIG, AUTO_APPEND_MARGIN_KEY } from './futuresConfig';
import { TipsBox } from './style';

const AutoMarginTips = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.futuresSetting.tipsVisible);
  const autoMarginTipsStatus = useSelector((state) => state.futuresSetting.autoMarginTipsStatus);
  const tipsCallback = useSelector((state) => state.futuresSetting.tipsCallback);
  const [noTips, setNoTips] = useState(false);
  const onCancel = () => {
    dispatch({
      type: 'futuresSetting/update',
      payload: {
        tipsVisible: false,
        autoMarginTipsStatus: false,
        tipsCallback: () => {},
      },
    });
    setNoTips(false);
  };
  const sureEvent = () => {
    if (noTips) {
      dispatch({
        type: 'futuresSetting/setConfirmByBool',
        payload: {
          type: CONFIRM_CONFIG,
          value: AUTO_APPEND_MARGIN_KEY,
          status: true, // 设置值取反逻辑
        },
      });
    }
    tipsCallback();
    onCancel();
  };
  return (
    <AdaptiveModal
      open={visible}
      title={_t(!autoMarginTipsStatus ? 'autoOpen.title' : 'autoClose.title')}
      okText={_t('confirm')}
      cancelText={''}
      onCancel={onCancel}
      onOk={sureEvent}
      okButtonProps={{ size: 'large' }}
    >
      <div>{!autoMarginTipsStatus ? _tHTML('autoOpen.tips') : _t('autoClose.tips')}</div>
      <TipsBox>
        <Checkbox checked={noTips} onChange={(e) => setNoTips(e.target.checked)}>
          {_t('preferences.display')}
        </Checkbox>
      </TipsBox>
    </AdaptiveModal>
  );
};

export default React.memo(AutoMarginTips);
