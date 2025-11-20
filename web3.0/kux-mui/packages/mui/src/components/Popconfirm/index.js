/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/index';
import { ICInfoFilled } from '@kux/icons';
import classNames from 'clsx';
import elementAcceptingRef from 'utils/elementAcceptingRef';
import {
  useTheme,
  useForkRef,
  useEventCallback,
  useIsFocusVisible,
  useId,
  useDynamicID,
  useControlled,
  useClickListenAway,
} from 'hooks/index';
import { composeClassNames } from 'styles/index';
import getPopconfirmClassName from './classeNames';
import Button from '../Button';
import Grow from '../Grow';
import Popper from '../Popper';

const useClassNames = (state) => {
  const { classNames: classNamesFromProps } = state;
  const slots = {
    root: ['root'],
    icon: ['icon'],
    content: ['content'],
    arrow: ['arrow'],
    buttons: ['buttons'],
    title: ['title'],
  };
  return composeClassNames(slots, getPopconfirmClassName, classNamesFromProps);
};

const PopPopper = styled(Popper)`
  z-index: ${(props) => props.theme.zIndices.tooltip};
`;

const PopconfirmTooltip = styled.div`
  min-width: 280px;
  position: relative;
  background: ${(props) => props.theme.colors.layer};
  border-radius: 8px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
`;

const PopconfirmTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  font-size: 14px;
  line-height: 18px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;

const PopconfirmArrow = styled.div`
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

const PopconfirmArrowContent = styled.span`
  width: 6px;
  height: 6px;
  background: ${(props) => props.theme.colors.layer};
  margin: auto;
  pointer-events: none;
  display: block;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
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

const PopconfirmMessage = styled.div`
  display: flex;
  align-items: center;
`;

const PopconfirmIcon = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 6px;
  align-self: baseline;
  color: ${(props) => props.theme.colors.cover};
  padding-top: 0.5px;
`;

const PopconfirmContent = styled.div`
  padding: 24px 20px 16px;
`;

const PopconfirmButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  button {
    margin-left: 8px;
  }
`;

function composeEventHandler(handler, eventHandler) {
  return (event) => {
    if (eventHandler) {
      eventHandler(event);
    }
    handler(event);
  };
}

const Popconfirm = React.forwardRef((props, ref) => {
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
    showIcon,
    icon,
    okText,
    cancelText,
    onConfirm,
    onCancel,
    offset,
    rootClass,
    contentClass,
    arrowClass,
    okButtonProps,
    cancelButtonProps,
    ...other
  } = props;

  const theme = useTheme();

  const [childNode, setChildNode] = React.useState();
  const [arrowRef, setArrowRef] = React.useState(null);
  const ignoreNonTouchEvents = React.useRef(false);
  // 用于SEO ARIA 属性
  const alertdialogTitleId = useDynamicID();

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
    console.log('handleClickAwayhandleClickAway');
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

  const handleCancel = (event) => {
    handleLeave(event);
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleConfirm = (event) => {
    handleLeave(event);
    if (props.onConfirm) {
      props.onConfirm();
    }
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

  const _classNames = useClassNames(commonState);

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
        {...commonState}
        {...interactiveWrapperListeners}
      >
        {({ TransitionProps: TransitionPropsInner, placement: relPlacement }) => {
          return (
            <Grow timeout={theme.transitions.duration.shorter} {...TransitionPropsInner}>
              <PopconfirmTooltip
                {...commonState}
                className={classNames(rootClass, _classNames.root)}
                theme={theme}
                data-placement={relPlacement}
                role="alertdialog"
                aria-describedby={alertdialogTitleId}
              >
                <PopconfirmContent
                  theme={theme}
                  className={classNames(contentClass, _classNames.content)}
                >
                  <PopconfirmMessage>
                    {showIcon ? (
                      <PopconfirmIcon className={_classNames.icon} theme={theme}>
                        {icon || <ICInfoFilled size={16} color={theme.colors.cover} />}
                      </PopconfirmIcon>
                    ) : null}
                    <PopconfirmTitle
                      className={_classNames.title}
                      theme={theme}
                      id={alertdialogTitleId}
                    >
                      {title}
                    </PopconfirmTitle>
                  </PopconfirmMessage>
                  <PopconfirmButtons className={_classNames.buttons} theme={theme}>
                    <Button
                      size="mini"
                      variant="outlined"
                      onClick={handleCancel}
                      style={{ minWidth: 72 }}
                      {...okButtonProps}
                    >
                      {cancelText}
                    </Button>
                    <Button
                      size="mini"
                      variant="contained"
                      type="primary"
                      onClick={handleConfirm}
                      style={{ minWidth: 72 }}
                      {...cancelButtonProps}
                    >
                      {okText}
                    </Button>
                  </PopconfirmButtons>
                </PopconfirmContent>
                {arrow ? (
                  <PopconfirmArrow
                    {...commonState}
                    ref={setArrowRef}
                    className={classNames(arrowClass, _classNames.arrow)}
                    data-placement={relPlacement}
                    theme={theme}
                  >
                    <PopconfirmArrowContent data-placement={relPlacement} theme={theme} />
                  </PopconfirmArrow>
                ) : null}
              </PopconfirmTooltip>
            </Grow>
          );
        }}
      </PopPopper>
    </>
  );
});

Popconfirm.displayName = 'Popconfirm';

Popconfirm.propTypes = {
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
  title: PropTypes.node.isRequired,
  icon: PropTypes.node,
  showIcon: PropTypes.bool,
  cancelText: PropTypes.node,
  okText: PropTypes.node,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  offset: PropTypes.number,
};

Popconfirm.defaultProps = {
  trigger: 'click',
  placement: 'bottom',
  arrow: true,
  showIcon: true,
  cancelText: 'no',
  okText: 'yes',
  offset: 10,
};

export default Popconfirm;
