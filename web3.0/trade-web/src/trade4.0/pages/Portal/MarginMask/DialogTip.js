/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useCallback, useEffect } from 'react';
import { _t, _tHTML } from 'src/utils/lang';
import sentry from '@kc/sentry';
import { loadImg } from 'helper';
import infoDark from '@/assets/toolbar/counp-dark.png';
import infoLight from '@/assets/toolbar/counp-light.png';
import useSensorFunc from '@/hooks/useSensorFunc';
import { useDispatch, useSelector } from 'dva';
import { useTheme, useSnackbar } from '@kux/mui';
import AnswerTest from '../AnswerTest';

/**
 * DialogTip
 * 开启您的杠杆交易之旅 提示弹窗
 */
const DialogTip = (props) => {
  const { ...restProps } = props;
  const dispatch = useDispatch();
  const sensorFunc = useSensorFunc();
  const { message } = useSnackbar();
  const { currentTheme } = useTheme();

  const openMarginVisible = useSelector((state) => state.marginMeta.openMarginVisible);

  const answerOptions = useSelector((state) => state.marginMeta.examContent) || [];
  const answerSubmitApiLoading = useSelector(
    (state) => state.loading.effects['marginMeta/userSignAgreement'],
  );
  const answerExamApiLoading = useSelector(
    (state) => state.loading.effects['marginMeta/pullMarginTradeExamContent'],
  );

  const agreement = useSelector((state) => state.marginMeta.agreement);
  const agreementApiLoading = useSelector(
    (state) => state.loading.effects['marginMeta/pullAgreementContent'],
  );

  const answerExamApi = () =>
    dispatch({
      type: 'marginMeta/pullMarginTradeExamContent',
    });

  const agreementApi = () =>
    dispatch({
      type: 'marginMeta/pullAgreementContent',
    });

  const handleAnserOk = async () => {
    // setVisible(false);
    // 预加载杠杆新人福利包图片
    loadImg([currentTheme === 'dark' ? infoDark : infoLight]);

    try {
      const res = await dispatch({
        type: 'marginMeta/userSignAgreement',
      });

      if (res) {
        sensorFunc(['openMarginAgreement', 'openMarginSuccess']);
      }
    } catch (err) {
      if (err.msg) {
        message.error(err.msg);
      }
      try {
        sentry.captureEvent({
          level: 'fatal',
          message: `openMargin-failed: ${err?.msg || '-'}`,
          tags: {
            fatal_type: 'openMargin',
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (openMarginVisible) {
      // 开通杠杆交易按钮埋点
      sensorFunc(['openMarginAgreement', 'open']);
    }
  }, [openMarginVisible, sensorFunc]);

  const handleTipCancel = useCallback(() => {
    dispatch({
      type: 'marginMeta/update',
      payload: {
        openMarginVisible: false,
      },
    });
  }, []);

  return (
    <AnswerTest
      visible={openMarginVisible}
      onTipCancel={handleTipCancel}
      tipDialogTitle={_t('r4BhZCnqqPejnc83cA8BpG')}
      tipDialogContent={_t('3zVcf47cgrTj43PNw2gP3c')}
      tipDialogOkText={_t('aRnwMHDubSc6mibmLEjnqK')}
      answerDialogTitle={_t('ptp6Pw6J9pBFv9oBzQ4XsW')}
      answerDialogOkText={_t('aRnwMHDubSc6mibmLEjnqK')}
      answerOptions={answerOptions}
      answerDialogProtocalText={_tHTML('peCSvWcSabqYKtyhnVn72w')}
      answerExamApi={answerExamApi}
      answerSubmitApiLoading={answerSubmitApiLoading}
      answerExamApiLoading={answerExamApiLoading}
      answerProtocalSensor={['openMarginAgreement', 'openConfirm', 'click']}
      answerExposeSensor={['openMarginAgreement', 'openConfirm', 'expose']}
      agreementTitle={agreement.title}
      agreementApi={agreementApi}
      agreementApiLoading={agreementApiLoading}
      agreementContent={agreement.content}
      onAnswerOk={handleAnserOk}
      {...restProps}
    />
  );
};

export default memo(DialogTip);
