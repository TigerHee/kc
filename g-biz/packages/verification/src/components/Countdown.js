/**
 * Owner: vijay.zhou@kupotech.com
 */
import { SpinOutlined } from '@kux/icons';
import { styled, keyframes } from '@kux/mui';
import { useMemo } from 'react';
import { SuffixButton } from './commonUIs';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpan = styled(SuffixButton)`
  color: ${(props) =>
    props.isCountingDown ? props.theme.colors.text40 : props.theme.colors.primary};
`;

const StyledSpin = styled(SpinOutlined)`
  animation: ${spin} 1s linear infinite;
`;

export default function Countdown(props) {
  const { count, loading, text, onClick, ...restProps } = props;
  const isCountingDown = useMemo(() => count > 0, [count]);

  return (
    <StyledSpan
      onClick={() => {
        !loading && !isCountingDown && onClick();
      }}
      disabled={loading || isCountingDown}
      isCountingDown={isCountingDown}
      size="large"
      data-count={count}
      {...restProps}
    >
      {loading ? <StyledSpin size={20} /> : isCountingDown ? `${count}s` : text}
    </StyledSpan>
  );
}
