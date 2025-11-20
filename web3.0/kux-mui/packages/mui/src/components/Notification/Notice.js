/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import useEventCallback from 'hooks/useEventCallback';
import styled, { isPropValid } from 'emotion/index';

const Wrapper = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {};
});

const Notice = React.forwardRef((props, ref) => {
  const {
    children,
    autoHideDuration,
    onClose,
    open,
    onMouseEnter,
    onMouseLeave,
    resumeHideDuration,
    ...other
  } = props;

  const timerAutoHide = React.useRef();

  const handleClose = useEventCallback(() => {
    if (onClose) {
      onClose();
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

  const handlePause = () => {
    clearTimeout(timerAutoHide.current);
  };

  const handleResume = React.useCallback(() => {
    if (autoHideDuration != null) {
      setAutoHideTimer(resumeHideDuration != null ? resumeHideDuration : autoHideDuration * 0.5);
    }
  }, [autoHideDuration, resumeHideDuration, setAutoHideTimer]);

  const handleMouseEnter = (event) => {
    if (onMouseEnter) {
      onMouseEnter(event);
    }
    handlePause();
  };

  const handleMouseLeave = (event) => {
    if (onMouseLeave) {
      onMouseLeave(event);
    }
    handleResume();
  };

  return (
    <Wrapper ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...other}>
      {children}
    </Wrapper>
  );
});

export default Notice;
