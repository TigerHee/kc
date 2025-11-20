/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import styled, { isPropValid } from 'emotion/index';
import useEventCallback from 'hooks/useEventCallback';

const Wrapper = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {};
});

const Snackbar = React.forwardRef((props, ref) => {
  const { children, autoHideDuration, onClose, open, ...other } = props;

  const timerAutoHide = React.useRef();

  const handleClose = useEventCallback((...args) => {
    if (onClose) {
      onClose(...args);
    }
  });
  const setAutoHideTimer = useEventCallback((autoHideDurationParam) => {
    if (!onClose || autoHideDurationParam == null) {
      return;
    }
    clearTimeout(timerAutoHide.current);

    timerAutoHide.current = setTimeout(() => {
      handleClose(null);
    }, autoHideDurationParam);
  });

  React.useEffect(() => {
    if (open) {
      setAutoHideTimer(autoHideDuration);
    }
    return () => {
      clearTimeout(timerAutoHide.current);
    };
  }, [open, autoHideDuration, setAutoHideTimer]);

  return (
    <Wrapper ref={ref} {...other}>
      {children}
    </Wrapper>
  );
});

export default Snackbar;
