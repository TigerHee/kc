/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Loading } from '@kux/design';
import { useMemo } from 'react';
import styles from './styles.module.scss';

interface CountdownProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  loading: boolean;
  text: string;
  onClick: () => void;
}

export default function Countdown(props: CountdownProps) {
  const { count, loading, text, onClick, ...restProps } = props;
  const isCountingDown = useMemo(() => count > 0, [count]);

  return (
    <span
      className={`${styles.suffixButton} ${styles.styledSpan} ${isCountingDown ? styles.isCountingDown : ''}`}
      onClick={() => {
        !loading && !isCountingDown && onClick();
      }}
      data-count={count}
      {...restProps}
    >
      {loading ? <Loading size="small" type="brand" /> : isCountingDown ? `${count}s` : text}
    </span>
  );
}
