/**
 * Owner: tiger@kupotech.com
 * 百分比输入框
 */
import { InputNumber } from '@kux/mui';

export default (props) => {
  return (
    <InputNumber
      {...props}
      unit="%"
      type="number"
      step={0.01}
      precision={2}
      max={100}
      min={0}
      autoFixPrecision
      controls={false}
    />
  );
};
