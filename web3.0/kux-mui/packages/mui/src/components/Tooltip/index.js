/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import elementAcceptingRef from 'utils/elementAcceptingRef';
import {
  useTheme,
  useForkRef,
  useEventCallback,
  useIsFocusVisible,
  useId,
  useControlled,
  useClickListenAway,
} from 'hooks/index';
import useClassNames from './useClassNames';
import Grow from '../Grow';
import {
  TooltipPopper,
  TooltipTooltip,
  TooltipTitle,
  TooltipArrow,
  TooltipArrowContent,
} from './kux';

let hystersisOpen = false;
let hystersisTimer = null;

function composeEventHandler(handler, eventHandler) {
  return (event) => {
    if (eventHandler) {
      eventHandler(event);
    }
    handler(event);
  };
}

const Tooltip = React.forwardRef((props, ref) => {
  const {
    children,
    arrow,
    enterDelay,
    enterNextDelay,
    id: idProp,
    leaveDelay,
    onClose,
    onOpen,
    open: openProp,
    placement,
    title,
    trigger,
    className,
    offset,
    tipPopperOptions,
    popperStyle,
    ...other
  } = props;

  const theme = useTheme();
  const [childNode, setChildNode] = React.useState();
  const [arrowRef, setArrowRef] = React.useState(null);
  const ignoreNonTouchEvents = React.useRef(false);

  const closeTimer = React.useRef();
  const enterTimer = React.useRef();
  const leaveTimer = React.useRef();

  const [openState, setOpenState] = useControlled({
    controlled: openProp,
    default: false,
    name: 'Tooltip',
    state: 'open',
  });

  let open = openState;

  const id = useId(idProp);

  const prevUserSelect = React.useRef();
  const stopTouchInteraction = React.useCallback(() => {
    if (prevUserSelect.current !== undefined) {
      document.body.style.WebkitUserSelect = prevUserSelect.current;
      prevUserSelect.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(closeTimer.current);
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
      stopTouchInteraction();
    };
  }, [stopTouchInteraction]);

  const handleOpen = (event) => {
    clearTimeout(hystersisTimer);
    hystersisOpen = true;
    setOpenState(true);
    if (onOpen && !open) {
      onOpen(event);
    }
  };

  const handleClose = useEventCallback((event) => {
    clearTimeout(hystersisTimer);
    hystersisTimer = setTimeout(() => {
      hystersisOpen = false;
    }, 800 + leaveDelay);
    setOpenState(false);

    if (onClose && open) {
      onClose(event);
    }

    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      ignoreNonTouchEvents.current = false;
    }, theme.transitions.duration.shortest);
  });

  const handleEnter = (event) => {
    if (ignoreNonTouchEvents.current && event.type !== 'touchstart') {
      return;
    }
    if (childNode) {
      childNode.removeAttribute('title');
    }
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    if (enterDelay || (hystersisOpen && enterNextDelay)) {
      enterTimer.current = setTimeout(
        () => {
          handleOpen(event);
        },
        hystersisOpen ? enterNextDelay : enterDelay,
      );
    } else {
      handleOpen(event);
    }
  };

  const handleLeave = (event) => {
    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      handleClose(event);
    }, leaveDelay);
  };

  const handleClickAway = () => {
    if (open) {
      handleLeave();
    }
  };

  const handleClick = (event) => {
    if (open) {
      handleLeave(event);
    } else {
      handleEnter(event);
    }
  };

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible();

  const [, setChildIsFocusVisible] = React.useState(false);

  const handleBlur = (event) => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setChildIsFocusVisible(false);
      handleLeave(event);
    }
  };

  const handleFocus = (event) => {
    if (!childNode) {
      setChildNode(event.currentTarget);
    }

    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setChildIsFocusVisible(true);
      handleEnter(event);
    }
  };

  const detectTouchStart = (event) => {
    ignoreNonTouchEvents.current = true;
    const childrenProps = children.props;
    if (childrenProps.onTouchStart) {
      childrenProps.onTouchStart(event);
    }
  };

  const handleMouseOver = handleEnter;

  const handleMouseLeave = handleLeave;

  const handleTouchStart = (event) => {
    detectTouchStart(event);
    clearTimeout(leaveTimer.current);
    clearTimeout(closeTimer.current);
    stopTouchInteraction();
    prevUserSelect.current = document.body.style.WebkitUserSelect;
    document.body.style.WebkitUserSelect = 'none';
    document.body.style.WebkitUserSelect = prevUserSelect.current;
    handleEnter(event);
  };

  const handleTouchEnd = (event) => {
    if (children.props.onTouchEnd) {
      children.props.onTouchEnd(event);
    }

    stopTouchInteraction();
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      handleClose(event);
    }, leaveDelay);
  };

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        handleClose(nativeEvent);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, open]);

  const handleUseRef = useForkRef(setChildNode, ref);
  const handleFocusRef = useForkRef(focusVisibleRef, handleUseRef);
  const handleRef = useForkRef(children.ref, handleFocusRef);

  if (title === '') {
    open = false;
  }
  const popperRef = React.useRef();

  const childrenProps = {
    ...children.props,
    ref: handleRef,
  };

  const interactiveWrapperListeners = {};

  if (trigger === 'hover') {
    childrenProps.onTouchStart = handleTouchStart;
    childrenProps.onTouchEnd = handleTouchEnd;
    childrenProps.onMouseOver = composeEventHandler(handleMouseOver, childrenProps.onMouseOver);
    childrenProps.onMouseLeave = composeEventHandler(handleMouseLeave, childrenProps.onMouseLeave);
    interactiveWrapperListeners.onMouseOver = handleMouseOver;
    interactiveWrapperListeners.onMouseLeave = handleMouseLeave;
    childrenProps.onFocus = composeEventHandler(handleFocus, childrenProps.onFocus);
    childrenProps.onBlur = composeEventHandler(handleBlur, childrenProps.onBlur);
    interactiveWrapperListeners.onFocus = handleFocus;
    interactiveWrapperListeners.onBlur = handleBlur;
  } else {
    childrenProps.onClick = composeEventHandler(handleClick, childrenProps.onClick);
  }

  const popperOptions = React.useMemo(() => {
    const tooltipModifiers = [
      {
        name: 'arrow',
        enabled: Boolean(arrowRef),
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, offset],
        },
      },
    ];

    return {
      modifiers: tooltipModifiers,
      ...tipPopperOptions,
    };
  }, [arrowRef, offset, tipPopperOptions]);

  useClickListenAway(() => {
    handleClickAway();
  }, [childNode, popperRef]);

  const _classNames = useClassNames({ placement });

  return (
    <>
      {React.cloneElement(children, childrenProps)}
      <TooltipPopper
        id={id}
        transition
        placement={placement}
        anchorEl={childNode}
        ref={popperRef}
        open={childNode ? open : false}
        popperOptions={popperOptions}
        theme={theme}
        style={popperStyle}
        className={_classNames.popper}
        {...interactiveWrapperListeners}
      >
        {({ TransitionProps: TransitionPropsInner, placement: relPlacement }) => {
          return (
            <Grow timeout={theme.transitions.duration.shorter} {...TransitionPropsInner}>
              <TooltipTooltip
                theme={theme}
                className={clsx(_classNames.root, className)}
                {...other}
              >
                <TooltipTitle className={_classNames.title} theme={theme}>
                  {title}
                </TooltipTitle>
                {arrow ? (
                  <TooltipArrow
                    ref={setArrowRef}
                    data-placement={relPlacement}
                    theme={theme}
                    className={_classNames.arrow}
                  >
                    <TooltipArrowContent data-placement={relPlacement} theme={theme} />
                  </TooltipArrow>
                ) : null}
              </TooltipTooltip>
            </Grow>
          );
        }}
      </TooltipPopper>
    </>
  );
});

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  trigger: PropTypes.oneOf(['hover', 'click']),
  arrow: PropTypes.bool,
  children: elementAcceptingRef.isRequired,
  enterDelay: PropTypes.number,
  enterNextDelay: PropTypes.number,
  id: PropTypes.string,
  leaveDelay: PropTypes.number,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.bool,
  placement: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  title: PropTypes.node,
  offset: PropTypes.number,
  tipPopperOptions: PropTypes.object,
  popperStyle: PropTypes.object,
};

Tooltip.defaultProps = {
  trigger: 'hover',
  placement: 'top',
  arrow: true,
  enterDelay: 100,
  enterNextDelay: 0,
  leaveDelay: 0,
  offset: 10,
};

export default Tooltip;
