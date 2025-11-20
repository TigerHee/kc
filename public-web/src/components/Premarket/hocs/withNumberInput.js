/**
 * Owner: solar.xia@kupotech.com
 */
import { useState } from 'react';

// 使Input框变成只能输入数字的InputNumber框
export default (WrappedComponent) => {
  return (props) => {
    const [value, setValue] = useState('');
    const handleChange = (event) => {
      const { value } = event.target;
      // 使用正则表达式检查值是否为大于等于0的整数或小数
      const isValidNumber = /^(\d+\.?\d*|\.\d+)$/.test(value) || value === '';
      if (isValidNumber) {
        setValue(value);
        // 如果有传入onChange props，那么也调用它
        if (props.onChange) {
          props.onChange(event);
        }
      }
    };
    return <WrappedComponent {...props} value={value} onChange={handleChange} />;
  };
};
