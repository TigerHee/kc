import * as React from 'react';
import { flushSync } from 'react-dom';
import debounce from 'lodash-es/debounce';
import useForkRef from 'hooks/useForkRef';
import useEnhancedEffect from 'hooks/useEnhancedEffect';
import ownerWindow from 'utils/ownerWindow';
import styled, { isPropValid } from 'emotion/index';

const StyledArea = styled('textarea', {
  shouldForwardProp: (props) => isPropValid(props),
})``;

function getStyleValue(computedStyle, property) {
  return parseInt(computedStyle[property], 10) || 0;
}

const styles = {
  shadow: {
    // Visibility needed to hide the extra text area on iPads
    visibility: 'hidden',
    // Remove from the content flow
    position: 'absolute',
    // Ignore the scrollbar width
    overflow: 'hidden',
    height: 0,
    top: 0,
    left: 0,
    // Create a new layer, increase the isolation of the computed values
    transform: 'translateZ(0)',
  },
};

function isEmpty(obj) {
  return obj === undefined || obj === null || Object.keys(obj).length === 0;
}

const TextareaAutosize = React.forwardRef(function TextareaAutosize(props, ref) {
  const { onChange, maxRows, minRows = 1, style, value, ...other } = props;

  const { current: isControlled } = React.useRef(value != null);
  const inputRef = React.useRef(null);
  const handleRef = useForkRef(ref, inputRef);
  const shadowRef = React.useRef(null);
  const renders = React.useRef(0);
  const [state, setState] = React.useState({});

  const getUpdatedState = React.useCallback(() => {
    const input = inputRef.current;
    const containerWindow = ownerWindow(input);
    const computedStyle = containerWindow.getComputedStyle(input);

    // If input's width is shrunk and it's not visible, don't sync height.
    if (computedStyle.width === '0px') {
      return {};
    }

    const inputShallow = shadowRef.current;
    inputShallow.style.width = computedStyle.width;
    inputShallow.value = input.value || props.placeholder || 'x';
    if (inputShallow.value.slice(-1) === '\n') {
      // Certain fonts which overflow the line height will cause the textarea
      // to report a different scrollHeight depending on whether the last line
      // is empty. Make it non-empty to avoid this issue.
      inputShallow.value += ' ';
    }

    const boxSizing = computedStyle['box-sizing'];
    const padding =
      getStyleValue(computedStyle, 'padding-bottom') + getStyleValue(computedStyle, 'padding-top');
    const border =
      getStyleValue(computedStyle, 'border-bottom-width') +
      getStyleValue(computedStyle, 'border-top-width');

    // The height of the inner content
    const innerHeight = inputShallow.scrollHeight;

    // Measure height of a textarea with a single row
    inputShallow.value = 'x';
    const singleRowHeight = inputShallow.scrollHeight;

    // The height of the outer content
    let outerHeight = innerHeight;

    if (minRows) {
      outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight);
    }
    if (maxRows) {
      outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight);
    }
    outerHeight = Math.max(outerHeight, singleRowHeight);

    // Take the box sizing into account for applying this value as a style.
    const outerHeightStyle = outerHeight + (boxSizing === 'border-box' ? padding + border : 0);
    const overflow = Math.abs(outerHeight - innerHeight) <= 1;

    return { outerHeightStyle, overflow };
  }, [maxRows, minRows, props.placeholder]);

  const updateState = (prevState, newState) => {
    const { outerHeightStyle, overflow } = newState;
    // Need a large enough difference to update the height.
    // This prevents infinite rendering loop.
    if (
      renders.current < 20 &&
      ((outerHeightStyle > 0 &&
        Math.abs((prevState.outerHeightStyle || 0) - outerHeightStyle) > 1) ||
        prevState.overflow !== overflow)
    ) {
      renders.current += 1;
      return {
        overflow,
        outerHeightStyle,
      };
    }
    if (process.env.NODE_ENV !== 'production') {
      if (renders.current === 20) {
        console.error(
          [
            'Vaex-MUI: Too many re-renders. The layout is unstable.',
            'TextareaAutosize limits the number of renders to prevent an infinite loop.',
          ].join('\n'),
        );
      }
    }
    return prevState;
  };

  const syncHeight = React.useCallback(() => {
    const newState = getUpdatedState();

    if (isEmpty(newState)) {
      return;
    }

    setState((prevState) => {
      return updateState(prevState, newState);
    });
  }, [getUpdatedState]);

  const syncHeightWithFlushSycn = () => {
    const newState = getUpdatedState();

    if (isEmpty(newState)) {
      return;
    }

    flushSync(() => {
      setState((prevState) => {
        return updateState(prevState, newState);
      });
    });
  };

  React.useEffect(() => {
    const handleResize = debounce(() => {
      renders.current = 0;
      if (inputRef.current) {
        syncHeightWithFlushSycn();
      }
    }, 166);
    const containerWindow = ownerWindow(inputRef.current);
    containerWindow.addEventListener('resize', handleResize);
    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(inputRef.current);
    }

    return () => {
      containerWindow.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  });

  useEnhancedEffect(() => {
    syncHeight();
  });

  React.useEffect(() => {
    renders.current = 0;
  }, [value]);

  const handleChange = (event) => {
    renders.current = 0;

    if (!isControlled) {
      syncHeight();
    }

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <React.Fragment>
      <StyledArea
        value={value}
        onChange={handleChange}
        ref={handleRef}
        rows={minRows}
        style={{
          height: state.outerHeightStyle,
          overflow: state.overflow ? 'hidden' : null,
          ...style,
        }}
        {...other}
      />
      <textarea
        aria-hidden
        className={props.className}
        readOnly
        ref={shadowRef}
        tabIndex={-1}
        style={{
          ...styles.shadow,
          ...style,
          padding: 0,
        }}
      />
    </React.Fragment>
  );
});

export default TextareaAutosize;