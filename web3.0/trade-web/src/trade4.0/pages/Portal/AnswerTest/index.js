/**
 * Owner: Ray.Lee@kupotech.com
 */

import React, { memo, Fragment, useState, useCallback } from 'react';
import Dialog from '@mui/Dialog';
import { _t } from 'src/utils/lang';
import DialogAnswer from './DialogAnswer';

/**
 * AnswerTest
 * 答题测试 提示弹窗
 * 目前有 1. 开通杠杆 2. 杠杆代币 使用
 * 更改需要同步代码到 main-web, margin-web-3.0， 历史原因代码有差异，需酌情处理
 */
const AnswerTest = (props) => {
  const {
    visible,
    onTipCancel,

    // 一级弹窗
    tipDialogTitle,
    tipDialogContent,
    tipDialogOkText,

    // 答题弹窗
    answerDialogTitle,
    answerDialogOkText,
    answerOptions,
    answerDialogProtocalText,
    answerExamApi,
    answerSubmitApiLoading,
    answerExamApiLoading,
    protocalText,
    answerProtocalSensor,
    answerExposeSensor,
    onAnswerOk,

    // 协议弹窗
    agreementTitle,
    agreementContent,
    agreementApi,
    agreementApiLoading,

    ...restProps
  } = props;

  const [tradeTestVisible, setTradeTestVisible] = useState(false);

  const handleTradeTipOk = useCallback(() => {
    onTipCancel && onTipCancel();
    setTradeTestVisible(true);
  }, []);

  const handleAnserOk = async () => {
    await onAnswerOk();
    setTradeTestVisible(false);
  };

  return (
    <Fragment>
      <Dialog
        open={visible}
        size="basic"
        cancelText={_t('hq2AyTKuJR6uKyN9aJzPBD')}
        okText={tipDialogOkText}
        title={tipDialogTitle}
        onOk={handleTradeTipOk}
        onCancel={onTipCancel}
        {...restProps}
      >
        <div>{tipDialogContent}</div>
      </Dialog>

      {tradeTestVisible && (
        <DialogAnswer
          title={answerDialogTitle}
          okText={answerDialogOkText}
          answerOptions={answerOptions}
          open={tradeTestVisible}
          onCancel={() => setTradeTestVisible(false)}
          onOk={handleAnserOk}
          answerDialogProtocalText={answerDialogProtocalText}
          answerExamApi={answerExamApi}
          answerSubmitApiLoading={answerSubmitApiLoading}
          answerExamApiLoading={answerExamApiLoading}
          answerProtocalSensor={answerProtocalSensor}
          answerExposeSensor={answerExposeSensor}
          agreementTitle={agreementTitle}
          agreementApi={agreementApi}
          agreementApiLoading={agreementApiLoading}
          agreementContent={agreementContent}
        />
      )}
    </Fragment>
  );
};

export default memo(AnswerTest);
