/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import { createPopper } from '@popperjs/core';
import ownerDocument from 'utils/ownerDocument';
import useForkRef from 'hooks/useForkRef';
import useEnhancedEffect from 'hooks/useEnhancedEffect';
import Portal from '../Portal';

function flipPlacement(placement) {
  const direction = 'ltr';

  if (direction === 'ltr') {
    return placement;
  }

  switch (placement) {
    case 'bottom-end':
      return 'bottom-start';
    case 'bottom-start':
      return 'bottom-end';
    case 'top-end':
      return 'top-start';
    case 'top-start':
      return 'top-end';
    default:
      return placement;
  }
}

function resolveAnchorEl(anchorEl) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

const defaultPopperOptions = {};

const PopperTooltip = React.forwardRef(function PopperTooltip(props, ref) {
  const {
    anchorEl,
    children,
    disablePortal,
    modifiers,
    open,
    placement: initialPlacement,
    popperOptions,
    popperRef: popperRefProp,
    TransitionProps,
    ...other
  } = props;

  const tooltipRef = React.useRef(null);
  const ownRef = useForkRef(tooltipRef, ref);

  const popperRef = React.useRef(null);
  const handlePopperRef = useForkRef(popperRef, popperRefProp);
  const handlePopperRefRef = React.useRef(handlePopperRef);
  useEnhancedEffect(() => {
    handlePopperRefRef.current = handlePopperRef;
  }, [handlePopperRef]);
  React.useImperativeHandle(popperRefProp, () => popperRef.current, []);

  const rtlPlacement = flipPlacement(initialPlacement);
  const [placement, setPlacement] = React.useState(rtlPlacement);

  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.forceUpdate();
    }
  });

  useEnhancedEffect(() => {
    if (!anchorEl || !open) {
      return undefined;
    }

    const handlePopperUpdate = (data) => {
      setPlacement(data.placement);
    };

    let popperModifiers = [
      {
        name: 'preventOverflow',
        options: {
          altBoundary: disablePortal,
        },
      },
      {
        name: 'flip',
        options: {
          altBoundary: disablePortal,
        },
      },
      {
        name: 'onUpdate',
        enabled: true,
        phase: 'afterWrite',
        fn: ({ state }) => {
          handlePopperUpdate(state);
        },
      },
    ];

    if (modifiers != null) {
      popperModifiers = popperModifiers.concat(modifiers);
    }
    if (popperOptions && popperOptions.modifiers != null) {
      popperModifiers = popperModifiers.concat(popperOptions.modifiers);
    }

    const popper = createPopper(resolveAnchorEl(anchorEl), tooltipRef.current, {
      placement: rtlPlacement,
      ...popperOptions,
      modifiers: popperModifiers,
    });
    handlePopperRefRef.current(popper);

    return () => {
      popper.destroy();
      handlePopperRefRef.current(null);
    };
  }, [anchorEl, disablePortal, modifiers, open, popperOptions, rtlPlacement]);

  const childProps = { placement };

  if (TransitionProps !== null) {
    childProps.TransitionProps = TransitionProps;
  }

  return (
    <div ref={ownRef} role="tooltip" {...other}>
      {typeof children === 'function' ? children(childProps) : children}
    </div>
  );
});

const Popper = React.forwardRef(function Popper(props, ref) {
  const {
    anchorEl,
    children,
    container: containerProp,
    disablePortal = false,
    keepMounted = false,
    modifiers,
    open,
    placement = 'bottom',
    popperOptions = defaultPopperOptions,
    popperRef,
    style,
    transition = false,
    ...other
  } = props;

  const [exited, setExited] = React.useState(true);

  const handleEnter = () => {
    setExited(false);
  };

  const handleExited = () => {
    setExited(true);
  };

  if (!keepMounted && !open && (!transition || exited)) {
    return null;
  }

  const container =
    containerProp || (anchorEl ? ownerDocument(resolveAnchorEl(anchorEl)).body : undefined);

  return (
    <Portal disablePortal={disablePortal} container={container}>
      <PopperTooltip
        {...other}
        anchorEl={anchorEl}
        disablePortal={disablePortal}
        modifiers={modifiers}
        ref={ref}
        open={transition ? !exited : open}
        placement={placement}
        popperOptions={popperOptions}
        popperRef={popperRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: !open && keepMounted && !transition ? 'none' : null,
          ...style,
        }}
        TransitionProps={
          transition
            ? {
                in: open,
                onEnter: handleEnter,
                onExited: handleExited,
              }
            : null
        }
      >
        {children}
      </PopperTooltip>
    </Portal>
  );
});

export default Popper;
