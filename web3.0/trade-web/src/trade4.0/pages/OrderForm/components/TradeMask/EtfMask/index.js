/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { useCallback, useState, memo } from 'react';
import AuthMask from 'src/trade4.0/pages/Portal/AuthMask';
import { _t, _tHTML } from 'utils/lang';
import AnswerTest from 'src/trade4.0/pages/Portal/AnswerTest';
import { useDispatch, useSelector } from 'dva';
import { useSnackbar } from '@kux/mui';
/**
 * 开通杠杆代币遮罩
 * 更改需要同步 main-web, margin-web-3.0 逻辑
 */
const EtfMask = (props) => {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);

  const answerOptions = useSelector((state) => state.leveragedTokens.examContent) || [];

  const answerExamApi = () =>
    dispatch({
      type: 'leveragedTokens/pullEtfExamContent',
    });

  const answerExamApiLoading = useSelector(
    (state) => state.loading.effects['leveragedTokens/pullEtfExamContent'],
  );

  const answerSubmitApiLoading = useSelector(
    (state) => state.loading.effects['leveragedTokens/agreeAgreement'],
  );

  const agreementContent = useSelector((state) => state.leveragedTokens.agreement);

  const agreementApi = () =>
    dispatch({
      type: 'leveragedTokens/pullAgreementContent',
    });

  const agreementApiLoading = useSelector(
    (state) => state.loading.effects['leveragedTokens/pullAgreementContent'],
  );

  const handleAnserOk = async () => {
    try {
      await dispatch({
        type: 'leveragedTokens/agreeAgreement',
      });
      setVisible(false);
    } catch (err) {
      if (err.msg) {
        message.error(err.msg);
      }
    }
  };

  return (
    <AuthMask
      onClick={handleClick}
      desc={_t('etf.open.desc')}
      btnText={_t('etf.open.go')}
      {...props}
    >
      <AnswerTest
        visible={visible}
        onTipCancel={() => setVisible(false)}
        tipDialogTitle={_t('wBKguT8TST6YaVN9X5vcnS')}
        tipDialogContent={_t('hTxHSLVYUGZZBZ3X5r5oiN')}
        tipDialogOkText={_t('9DQ4izGDCy8HkiD5D9FzJY')}
        answerDialogTitle={_t('ccE83sgmVr2hGbjUESpUai')}
        answerDialogOkText={_t('9DQ4izGDCy8HkiD5D9FzJY')}
        answerOptions={answerOptions}
        answerDialogProtocalText={_tHTML('rntQ1ShmqXy3XH1UfEJ8GJ')}
        answerExamApi={answerExamApi}
        answerSubmitApiLoading={answerSubmitApiLoading}
        answerExamApiLoading={answerExamApiLoading}
        // answerProtocalSensor={['openMarginAgreement', 'openConfirm', 'click']}
        // answerExposeSensor={['openMarginAgreement', 'openConfirm', 'expose']}
        agreementTitle={_t('etf.risk.statement')}
        agreementApi={agreementApi}
        agreementApiLoading={agreementApiLoading}
        agreementContent={agreementContent}
        onAnswerOk={handleAnserOk}
      />
    </AuthMask>
  );
};

export default memo(EtfMask);
