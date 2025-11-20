/**
 * Owner: mike@kupotech.com
 * 封装 FormWrapper, 内置 onFinishFailed 事件，处理 Tooltip 展示问题
 * **注意事项** 提交表单需要使用 form.submit ，触发 onFinishFailed 或者 onFinish 事件
 * 传递参数 onFinish 需要换成 onSubmit
 * eventName 可以传递，避免事件响应覆盖
 */

import React from 'react';
import Form from '../Form';
import FormTooltipProvider from './FormTooltipProvider';
import { useResponsive } from '@kux/mui';

const FormWrapper = ({ form, children, activeTooltipCheck = true, ...rest }) => {
  const { sm, xs } = useResponsive();
  const isMin = !sm && xs; // 最小
  // 最小屏幕下 需要将tooltip转换成正常的input的错误提示显示
  return (
    <Form form={form} {...rest}>
      <FormTooltipProvider activeTooltipCheck={isMin ? false : activeTooltipCheck}>
        {children}
      </FormTooltipProvider>
    </Form>
  );
};

export default React.memo(FormWrapper);
