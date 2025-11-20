/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import styled from 'emotion/index';
import { duration } from 'themes/createTransitions';
import { getTransitionProps } from 'utils/transitions';
import useTheme from 'hooks/useTheme';
import useForkRef from 'hooks/useForkRef';

const CollapseRoot = styled.div(
  {
    height: 0,
    overflow: 'hidden',
  },
  ({ ownerState, theme }) => {
    let styles = {
      transition: theme.transitions.create('height'),
    };
    if (ownerState.orientation === 'horizontal') {
      styles = {
        ...styles,
        height: 'auto',
        width: 0,
        transition: theme.transitions.create('width'),
      };
    }

    if (ownerState.state === 'entered') {
      styles = {
        ...styles,
        height: 'auto',
        overflow: 'visible',
        ...(ownerState.orientation === 'horizontal' && {
          width: 'auto',
        }),
      };
    }
    if (ownerState.state === 'exited' && !ownerState.in && ownerState.collapsedSize === '0px') {
      styles = {
        ...styles,
        visibility: 'hidden',
      };
    }

    return styles;
  },
);

const CollapseWrapper = styled.div`
  display: flex;
  width: ${(props) => (props.orientation === 'horizontal' ? 'auto' : '100%')};
  height: ${(props) => (props.orientation === 'horizontal' ? '100%' : 'auto')};
`;

const CollapseWrapperInner = styled.div`
  width: ${(props) => (props.orientation === 'horizontal' ? 'auto' : '100%')};
  height: ${(props) => (props.orientation === 'horizontal' ? '100%' : 'auto')};
`;

const Collapse = React.forwardRef((props, ref) => {
  const {
    addEndListener,
    children,
    collapsedSize: collapsedSizeProp = '0px',
    component,
    easing,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    orientation = 'vertical',
    style,
    timeout = duration.standard,
    TransitionComponent = Transition,
    ...other
  } = props;

  const ownerState = {
    ...props,
    orientation,
    collapsedSize: collapsedSizeProp,
  };

  const theme = useTheme();
  const timer = React.useRef();
  const wrapperRef = React.useRef(null);
  const autoTransitionDuration = React.useRef();
  const collapsedSize =
    typeof collapsedSizeProp === 'number' ? `${collapsedSizeProp}px` : collapsedSizeProp;
  const isHorizontal = orientation === 'horizontal';
  const size = isHorizontal ? 'width' : 'height';

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const nodeRef = React.useRef(null);
  const handleRef = useForkRef(ref, nodeRef);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;

      if (maybeIsAppearing === undefined) {
        callback(node);
      } else {
        callback(node, maybeIsAppearing);
      }
    }
  };

  const getWrapperSize = () =>
    wrapperRef.current ? wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight'] : 0;

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = 'absolute';
    }
    node.style[size] = collapsedSize;

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });

  const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
    const wrapperSize = getWrapperSize();

    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = '';
    }

    const { duration: transitionDuration, easing: transitionTimingFunction } = getTransitionProps(
      { style, timeout, easing },
      {
        mode: 'enter',
      },
    );

    if (timeout === 'auto') {
      const duration2 = theme.transitions.getAutoHeightDuration(wrapperSize);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style[size] = `${wrapperSize}px`;
    node.style.transitionTimingFunction = transitionTimingFunction;

    if (onEntering) {
      onEntering(node, isAppearing);
    }
  });

  const handleEntered = normalizedTransitionCallback((node, isAppearing) => {
    node.style[size] = 'auto';

    if (onEntered) {
      onEntered(node, isAppearing);
    }
  });

  const handleExit = normalizedTransitionCallback((node) => {
    node.style[size] = `${getWrapperSize()}px`;

    if (onExit) {
      onExit(node);
    }
  });

  const handleExited = normalizedTransitionCallback(onExited);

  const handleExiting = normalizedTransitionCallback((node) => {
    const wrapperSize = getWrapperSize();
    const { duration: transitionDuration, easing: transitionTimingFunction } = getTransitionProps(
      { style, timeout, easing },
      {
        mode: 'exit',
      },
    );

    if (timeout === 'auto') {
      const duration2 = theme.transitions.getAutoHeightDuration(wrapperSize);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style[size] = collapsedSize;
    node.style.transitionTimingFunction = transitionTimingFunction;

    if (onExiting) {
      onExiting(node);
    }
  });

  const handleAddEndListener = (next) => {
    if (timeout === 'auto') {
      timer.current = setTimeout(next, autoTransitionDuration.current || 0);
    }
    if (addEndListener) {
      addEndListener(nodeRef.current, next);
    }
  };

  return (
    <TransitionComponent
      in={inProp}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      addEndListener={handleAddEndListener}
      nodeRef={nodeRef}
      timeout={timeout === 'auto' ? null : timeout}
      {...other}
    >
      {(state, childProps) => {
        return (
          <CollapseRoot
            style={{
              [isHorizontal ? 'minWidth' : 'minHeight']: collapsedSize,
              ...style,
            }}
            as={component}
            theme={theme}
            ref={handleRef}
            ownerState={{ ...ownerState, state }}
            {...childProps}
          >
            <CollapseWrapper orientation={orientation} ref={wrapperRef}>
              <CollapseWrapperInner orientation={orientation}>{children}</CollapseWrapperInner>
            </CollapseWrapper>
          </CollapseRoot>
        );
      }}
    </TransitionComponent>
  );
});

Collapse.propTypes = {
  addEndListener: PropTypes.func,
  children: PropTypes.node,
  collapsedSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  easing: PropTypes.oneOfType([
    PropTypes.shape({
      enter: PropTypes.string,
      exit: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  in: PropTypes.bool,
  onEnter: PropTypes.func,
  onEntered: PropTypes.func,
  onEntering: PropTypes.func,
  onExit: PropTypes.func,
  onExited: PropTypes.func,
  onExiting: PropTypes.func,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  style: PropTypes.object,
  timeout: PropTypes.oneOfType([
    PropTypes.oneOf(['auto']),
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
};

Collapse.muiSupportAuto = true;

export default Collapse;
