/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { duration, easing } from 'themes/createTransitions';
import { reflow, getTransitionProps } from 'utils/transitions';
import ownerWindow from 'utils/ownerWindow';
import debounce from 'utils/debounce';
import useTheme from 'hooks/useTheme';
import useForkRef from 'hooks/useForkRef';

function getTranslateValue(direction, node, resolvedContainer) {
  const rect = node.getBoundingClientRect();
  const containerRect = resolvedContainer && resolvedContainer.getBoundingClientRect();
  const containerWindow = ownerWindow(node);
  let transform;

  if (node.fakeTransform) {
    transform = node.fakeTransforsm;
  } else {
    const computedStyle = containerWindow.getComputedStyle(node);
    transform =
      computedStyle.getPropertyValue('-webkit-transform') ||
      computedStyle.getPropertyValue('transform');
  }

  let offsetX = 0;
  let offsetY = 0;

  if (transform && transform !== 'none' && typeof transform === 'string') {
    const transformValues = transform
      .split('(')[1]
      .split(')')[0]
      .split(',');
    offsetX = parseInt(transformValues[4], 10);
    offsetY = parseInt(transformValues[5], 10);
  }

  if (direction === 'left') {
    if (containerRect) {
      return `translateX(${containerRect.right + offsetX - rect.left}px)`;
    }

    return `translateX(${containerWindow.innerWidth + offsetX - rect.left}px)`;
  }

  if (direction === 'right') {
    if (containerRect) {
      return `translateX(-${rect.right - containerRect.left - offsetX}px)`;
    }

    return `translateX(-${rect.left + rect.width - offsetX}px)`;
  }

  if (direction === 'up') {
    if (containerRect) {
      return `translateY(${containerRect.bottom + offsetY - rect.top}px)`;
    }
    return `translateY(${containerWindow.innerHeight + offsetY - rect.top}px)`;
  }

  // direction === 'down'
  if (containerRect) {
    return `translateY(-${rect.top - containerRect.top + rect.height - offsetY}px)`;
  }
  return `translateY(-${rect.top + rect.height - offsetY}px)`;
}

function resolveContainer(containerPropProp) {
  return typeof containerPropProp === 'function' ? containerPropProp() : containerPropProp;
}

export function setTranslateValue(direction, node, containerProp) {
  const resolvedContainer = resolveContainer(containerProp);
  const transform = getTranslateValue(direction, node, resolvedContainer);

  if (transform) {
    node.style.webkitTransform = transform;
    node.style.transform = transform;
  }
}

const defaultEasing = {
  enter: easing.easeOut,
  exit: easing.sharp,
};

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
};

const Slide = React.forwardRef(function Slide(props, ref) {
  const {
    addEndListener,
    appear = true,
    children,
    container: containerProp,
    direction = 'down',
    easing: easingProp = defaultEasing,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    style,
    timeout = defaultTimeout,
    TransitionComponent = Transition,
    ...other
  } = props;

  const theme = useTheme();
  const childrenRef = React.useRef(null);
  const handleRefIntermediary = useForkRef(children.ref, childrenRef);
  const handleRef = useForkRef(handleRefIntermediary, ref);

  const normalizedTransitionCallback = (callback) => (isAppearing) => {
    if (callback) {
      // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
      if (isAppearing === undefined) {
        callback(childrenRef.current);
      } else {
        callback(childrenRef.current, isAppearing);
      }
    }
  };

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    setTranslateValue(direction, node, containerProp);
    reflow(node);

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });

  const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
    const transitionProps = getTransitionProps(
      { timeout, style, easing: easingProp },
      {
        mode: 'enter',
      },
    );

    node.style.webkitTransition = theme.transitions.create('-webkit-transform', {
      ...transitionProps,
    });

    node.style.transition = theme.transitions.create('transform', {
      ...transitionProps,
    });

    node.style.webkitTransform = 'none';
    node.style.transform = 'none';
    if (onEntering) {
      onEntering(node, isAppearing);
    }
  });

  const handleEntered = normalizedTransitionCallback(onEntered);
  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExit = normalizedTransitionCallback((node) => {
    const transitionProps = getTransitionProps(
      { timeout, style, easing: easingProp },
      {
        mode: 'exit',
      },
    );

    node.style.webkitTransition = theme.transitions.create('-webkit-transform', transitionProps);
    node.style.transition = theme.transitions.create('transform', transitionProps);

    setTranslateValue(direction, node, containerProp);

    if (onExit) {
      onExit(node);
    }
  });

  const handleExited = normalizedTransitionCallback((node) => {
    node.style.webkitTransition = '';
    node.style.transition = '';

    if (onExited) {
      onExited(node);
    }
  });

  const handleAddEndListener = (next) => {
    if (addEndListener) {
      addEndListener(childrenRef.current, next);
    }
  };

  const updatePosition = React.useCallback(() => {
    if (childrenRef.current) {
      setTranslateValue(direction, childrenRef.current, containerProp);
    }
  }, [direction, containerProp]);

  React.useEffect(() => {
    if (inProp || direction === 'down' || direction === 'right') {
      return undefined;
    }

    const handleResize = debounce(() => {
      if (childrenRef.current) {
        setTranslateValue(direction, childrenRef.current, containerProp);
      }
    });

    const containerWindow = ownerWindow(childrenRef.current);
    containerWindow.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
    };
  }, [direction, inProp, containerProp]);

  React.useEffect(() => {
    if (!inProp) {
      updatePosition();
    }
  }, [inProp, updatePosition]);

  return (
    <TransitionComponent
      nodeRef={childrenRef}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      addEndListener={handleAddEndListener}
      appear={appear}
      in={inProp}
      timeout={timeout}
      {...other}
    >
      {(state, childProps) => {
        return React.cloneElement(children, {
          ref: handleRef,
          style: {
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...style,
            ...children.props.style,
          },
          ...childProps,
        });
      }}
    </TransitionComponent>
  );
});

Slide.propTypes = {
  addEndListener: PropTypes.func,

  appear: PropTypes.bool,

  children: PropTypes.node.isRequired,

  direction: PropTypes.oneOf(['down', 'left', 'right', 'up']),

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

  style: PropTypes.object,

  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
};

export default Slide;
