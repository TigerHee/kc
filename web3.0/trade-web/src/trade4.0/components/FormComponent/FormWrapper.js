/**
 * Owner: garuda@kupotech.com
 * 封装 FormWrapper, 内置 onFinishFailed 事件，处理 Tooltip 展示问题
 * **注意事项** 提交表单需要使用 form.submit ，触发 onFinishFailed 或者 onFinish 事件
 * 传递参数 onFinish 需要换成 onSubmit
 * eventName 可以传递，避免事件响应覆盖
 */

import React, { useCallback } from 'react';
import { forEach } from 'lodash';

import Form from '@mui/Form';
import voice from '@/utils/voice';
import { evtEmitter } from 'helper';

import FormTooltipProvider from './FormTooltipProvider';

import { TOOLTIP_EVENT_KEY } from './config';

const event = evtEmitter.getEvt();
const FormWrapper = ({
  form,
  children,
  onSubmit,
  onFinishFailed,
  eventName = '',
  errorVoice,
  ...rest
}) => {
  const handleFinishFailed = useCallback(
    ({ errorFields, ...other }) => {
      const updateMessage = [];
      forEach(errorFields, ({ name, errors }) => {
        if (errors && errors.length) {
          updateMessage.push({ name, message: errors[0] });
        }
      });
      event.emit(`${TOOLTIP_EVENT_KEY}_${eventName}`, { type: 'update', data: updateMessage });
      onFinishFailed && onFinishFailed({ errorFields, ...other });
      if (errorVoice) {
        voice.notify('error_boundary');
      }
    },
    [eventName, onFinishFailed],
  );

  return (
    <Form form={form} onFinish={onSubmit} onFinishFailed={handleFinishFailed} {...rest}>
      <FormTooltipProvider eventName={eventName}>{children}</FormTooltipProvider>
    </Form>
  );
};

export default React.memo(FormWrapper);
