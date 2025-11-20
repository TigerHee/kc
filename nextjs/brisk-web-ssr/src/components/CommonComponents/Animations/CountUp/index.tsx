import { Statistic, type IStatisticProps } from '@kux/design';
import clsx from 'clsx';
import styles from './index.module.scss';
const PLUS_CHAR = '+';

type Props = Omit<IStatisticProps, 'value'> & { value: number | string };

function CountUp(props: Props) {
  const { suffix, value, duration = 2000, className, ...rest } = props || {};

  let isMore = false;
  let targetValue = value;
  if (typeof value === 'string' && (value as string).length > 1 && value[(value as string).length - 1] === PLUS_CHAR) {
    targetValue = Number(value.split(PLUS_CHAR)[0]);
    isMore = true;
  }
  const innerSuffix = !suffix && isMore ? PLUS_CHAR : suffix;

  return (
    <Statistic
      className={clsx([styles.statisticContent, className])}
      duration={duration}
      value={Number(targetValue)}
      {...rest}
      suffix={innerSuffix}
    />
  );
}

export default CountUp;
