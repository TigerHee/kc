/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/index';
import classNames from 'clsx';
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
import { composeClassNames } from 'styles/index';
import Grow from '../Grow';
import Popper from '../Popper';

import getPopoverClassName from './classNames';

const useClassClassNames = (state) => {
  const { classNames: classNamesFromProps } = state;
  const slots = {
    root: ['root'],
    title: ['title'],
    content: ['content'],
    arrow: ['arrow'],
    message: ['message'],
  };

  return composeClassNames(slots, getPopoverClassName, classNamesFromProps);
};

const PopPopper = styled(Popper)`
  z-index: ${(props) => props.theme.zIndices.tooltip};
`;

const PopoverTooltip = styled.div`
  position: relative;
  font-family: ${(props) => props.theme.fonts.family};
  background: #2e3034;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadows.middle};
`;

const PopoverTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  font-size: 14px;
  line-height: 22px;
  color: #f3f3f3;
  font-weight: 500;
  font-family: ${(props) => props.theme.fonts.family};
`;

const PopoverArrow = styled.div`
  overflow: hidden;
  position: absolute;
  width: 8px;
  height: 8px;
  box-sizing: border-box;
  transition: none;
  pointer-events: none;
  background: 0 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &[data-placement*='right'] {
    left: -8px;
  }
  &[data-placement*='left'] {
    right: -8px;
  }
  &[data-placement*='top'] {
    bottom: -8px;
  }
  &[data-placement*='bottom'] {
    top: -8px;
  }
`;

const PopoverArrowContent = styled.span`
  width: 6px;
  height: 6px;
  background: #2e3034;
  box-shadow: ${(props) => props.theme.shadows.middle};
  margin: auto;
  pointer-events: none;
  display: block;
  &[data-placement*='right'] {
    transform: translateX(4px) rotate(45deg);
  }
  &[data-placement*='left'] {
    transform: translateX(-4px) rotate(45deg);
  }
  &[data-placement*='top'] {
    transform: translateY(-4px) rotate(45deg);
  }
  &[data-placement*='bottom'] {
    transform: translateY(4px) rotate(45deg);
  }
`;

const PopoverMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #f3f3f3;
`;

const PopoverContent = styled.div`
  padding: 12px;
`;

function composeEventHandler(handler, eventHandler) {
  return (event) => {
    if (eventHandler) {
      eventHandler(event);
    }
    handler(event);
  };
}

const Popover = React.forwardRef((props, ref) => {
  const {
    children,
    arrow,
    id: idProp,
    onClose,
    onOpen,
    open: openProp,
    placement,
    title,
    trigger,
    content,
    offset,
    rootClass,
    contentClass,
    arrowClass,
    keepMounted = false,
    ...other
  } = props;

  const theme = useTheme();

  const [childNode, setChildNode] = React.useState();
  const [arrowRef, setArrowRef] = React.useState(null);
  const ignoreNonTouchEvents = React.useRef(false);

  const [openState, setOpenState] = useControlled({
    controlled: openProp,
    default: false,
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
      stopTouchInteraction();
    };
  }, [stopTouchInteraction]);

  const handleOpen = (event) => {
    setOpenState(true);
    if (onOpen && !open) {
      onOpen(event);
    }
  };

  const handleClose = useEventCallback((event) => {
    setOpenState(false);
    if (onClose && open) {
      onClose(event);
    }
    ignoreNonTouchEvents.current = false;
  });

  const handleEnter = (event) => {
    if (ignoreNonTouchEvents.current && event.type !== 'touchstart') {
      return;
    }
    if (childNode) {
      childNode.removeAttribute('title');
    }
    handleOpen(event);
  };

  const handleLeave = (event) => {
    handleClose(event);
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
    handleClose(event);
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
    ...other,
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
    const popConfirmModifiers = [
      {
        name: 'arrow',
        enabled: Boolean(arrowRef),
        options: {
          element: arrowRef,
          padding: 4,
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
      modifiers: popConfirmModifiers,
    };
  }, [arrowRef, offset]);

  const commonState = {
    ...other,
    placement,
  };

  useClickListenAway(() => {
    handleClickAway();
  }, [childNode, popperRef]);

  const _classNames = useClassClassNames(commonState);

  return (
    <>
      {React.cloneElement(children, childrenProps)}
      <PopPopper
        id={id}
        transition
        placement={placement}
        anchorEl={childNode}
        ref={popperRef}
        open={childNode ? open : false}
        popperOptions={popperOptions}
        theme={theme}
        keepMounted={keepMounted}
        {...commonState}
        {...interactiveWrapperListeners}
      >
        {({ TransitionProps: TransitionPropsInner, placement: relPlacement }) => {
          return (
            <Grow timeout={theme.transitions.duration.shorter} {...TransitionPropsInner}>
              <PopoverTooltip
                {...commonState}
                className={classNames(rootClass, _classNames.root)}
                theme={theme}
                data-placement={relPlacement}
              >
                <PopoverContent
                  className={classNames(contentClass, _classNames.content)}
                  theme={theme}
                >
                  <PopoverTitle className={_classNames.title} theme={theme}>
                    {title}
                  </PopoverTitle>
                  <PopoverMessage className={_classNames.message} theme={theme}>
                    {content}
                  </PopoverMessage>
                </PopoverContent>
                {arrow ? (
                  <PopoverArrow
                    {...commonState}
                    ref={setArrowRef}
                    className={classNames(arrowClass, _classNames.arrow)}
                    data-placement={relPlacement}
                    theme={theme}
                  >
                    <PopoverArrowContent data-placement={relPlacement} theme={theme} />
                  </PopoverArrow>
                ) : null}
              </PopoverTooltip>
            </Grow>
          );
        }}
      </PopPopper>
    </>
  );
});

Popover.displayName = 'Popover';

Popover.propTypes = {
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
};

Popover.defaultProps = {
  trigger: 'hover',
  placement: 'bottom',
  arrow: true,
  offset: 10,
};

export default Popover;
