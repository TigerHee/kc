/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Dialog } from '@kufox/mui';
import { isFunction } from 'lodash';
import { _t, _tHTML } from 'src/utils/lang';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { THEME_COLOR } from '../config';

const BodyWrapper = styled.div`
  width: 100%;
  margin-top: ${px2rem(-20)};
  .activity-end-text {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(24)};
    color: #00142a;
  }
  .highlight {
    color: ${THEME_COLOR.primary};
  }
`;

const TipDialog = () => {
  const dispatch = useDispatch();
  const { showTipDialog, dialogType, currentRound, activityConfig } = useSelector(
    state => state.prediction,
  );
  const { guessLimit } = activityConfig;
  const { closeTimeText } = currentRound;
  // 关闭弹窗
  const onClose = useCallback(
    () => {
      dispatch({
        type: 'prediction/update',
        payload: {
          showTipDialog: false,
          dialogType: undefined,
        },
      });
    },
    [dispatch],
  );

  // 弹窗配置
  const DIALOG_CONFIG = useMemo(
    () => ({
      EDUCATION: {
        title: () => '活动正在进行中',
        body: () => (
          <BodyWrapper>
            <div>请您竞猜下一轮结束时的ETH/USDT收盘价</div>
            <div>请您竞猜下一轮结束时的ETH/USDT收盘价</div>
            <div>请您竞猜下一轮结束时的ETH/USDT收盘价</div>
          </BodyWrapper>
        ),
        okText: () => '我知道了',
      },
      SCHEDULE_TIP: {
        title: () => _t('prediction.endPrice.title'),
        body: () => (
          <BodyWrapper>
            <div>{_tHTML('prediction.endPrice.tip1', { a: closeTimeText, b: 'ETH/USDT' })}</div>
            <div>{_t('prediction.endPrice.tip2', { a: closeTimeText })}</div>
            <div>{_t('prediction.endPrice.tip3')}</div>
            <div>{_tHTML('prediction.endPrice.tip4', { a: 'ETH/USDT' })}</div>
          </BodyWrapper>
        ),
        okText: () => _t('prediction.know'),
      },
      TRADE_TIP: {
        title: () => _t('prediction.myNumber'),
        body: () => (
          <BodyWrapper>
            <div>{_tHTML('prediction.price.tip1')}</div>
            <div>{_t('prediction.price.tip2', { a: guessLimit })}</div>
            <div>{_t('prediction.price.tip3')}</div>
            <div>{_tHTML('prediction.price.tip4')}</div>
            <div>{_tHTML('1wLzh6o8xybokYhKVep8CE')}</div>
          </BodyWrapper>
        ),
        okText: () => _t('prediction.know'),
      },
    }),
    [closeTimeText, guessLimit],
  );

  const config = DIALOG_CONFIG[dialogType];
  return (
    <Dialog
      size="mini"
      open={showTipDialog}
      title={config?.title && isFunction(config?.title) ? config?.title() : _t('')}
      onOk={config?.onOk && isFunction(config?.onOk) ? config?.onOk : onClose}
      onCancel={onClose}
      cancelText={null}
      showCloseX={false}
      okText={
        config?.okText && isFunction(config?.okText)
          ? config?.okText()
          : _t('newcomerGuide.prizeModal.button')
      }
      okButtonProps={{ style: { marginTop: '-12px', backgroundColor: THEME_COLOR.primary } }}
    >
      {config?.body && isFunction(config?.body) ? config?.body() : ''}
    </Dialog>
  );
};

export default TipDialog;
