/*
 * @owner: borden@kupotech.com
 */
import useSensorFunc from '@/hooks/useSensorFunc';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import useSide from '../../../hooks/useSide';
import getPercentageAmount from '../utils/getPercentageAmount';

export default function usePercent({ price, setFieldsValue }) {
  const { side } = useSide();
  const sensorFunc = useSensorFunc();

  const onChange = useMemoizedFn((percent) => {
    sensorFunc(['trading', percent]);
    const nextAmount = getPercentageAmount({
      side,
      price,
      percent,
    });
    setFieldsValue({
      amount: nextAmount,
    });
  });

  return {
    onChange,
  };
}
