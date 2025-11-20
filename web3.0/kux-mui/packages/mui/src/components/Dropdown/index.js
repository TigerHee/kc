/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useMergedState from 'hooks/useMergedState';
import { composeClassNames } from 'styles/index';
import clsx from 'clsx';
import styled from 'emotion/index';
import Popper from '../Popper';
import ClickAwayListener from '../ClickAwayListener';
import getDropDownClassName from './classNames';

const Container = styled.div`
  display: inline-flex;
`;

const useClassNames = (state) => {
  const { className: classNameFromProps, open } = state;
  const slots = {
    container: ['container'],
    trigger: ['trigger'],
    overlay: ['overlay', open && 'open'],
    popper: ['popper', open && 'open'],
  };
  return composeClassNames(slots, getDropDownClassName, classNameFromProps);
};

const Dropdown = React.forwardRef(
  (
    {
      style,
      visible,
      overlay,
      trigger,
      children,
      className,
      popperStyle,
      popperClassName,
      onVisibleChange,
      disablePortal,
      anchorProps: anchorPropsFromProps,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useMergedState(false, {
      value: visible,
    });

    const anchorRef = React.useRef(null);

    const handleOpen = React.useCallback(() => {
      setOpen(true);
      if (onVisibleChange) {
        onVisibleChange(true);
      }
    }, [onVisibleChange, setOpen]);

    const handleClose = React.useCallback(() => {
      setOpen(false);
      if (onVisibleChange) {
        onVisibleChange(false);
      }
    }, [onVisibleChange, setOpen]);

    const containerEventProps =
      trigger === 'hover'
        ? {
            onMouseOverCapture: handleOpen,
            onMouseLeave: handleClose,
          }
        : {};

    const anchorProps = {
      style: { display: 'inline-flex' },
      ...anchorPropsFromProps,
      ref: anchorRef,
    };

    if (trigger === 'click') {
      anchorProps.onClick = open ? handleClose : handleOpen;
    }

    const _classNames = useClassNames({ ...rest, open });

    return (
      <ClickAwayListener onClickAway={handleClose}>
        <Container
          ref={ref}
          {...containerEventProps}
          className={clsx(_classNames.container, className)}
        >
          <div {...anchorProps} className={_classNames.trigger}>
            {children}
          </div>
          <Popper
            {...rest}
            disablePortal={disablePortal}
            open={open}
            role="dropdown"
            className={clsx(_classNames.popper, popperClassName)}
            style={{ zIndex: 100, ...popperStyle }}
            anchorEl={anchorRef.current}
          >
            <div className={_classNames.overlay}>{overlay}</div>
          </Popper>
        </Container>
      </ClickAwayListener>
    );
  },
);

Dropdown.propTypes = {
  style: PropTypes.object,
  popperStyle: PropTypes.object,
  visible: PropTypes.bool,
  disablePortal: PropTypes.bool,
  className: PropTypes.string,
  anchorProps: PropTypes.object,
  onVisibleChange: PropTypes.func,
  overlay: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  trigger: PropTypes.oneOf(['click', 'hover']),
  keepMounted: PropTypes.bool,
};

Dropdown.defaultProps = {
  style: {},
  disablePortal: true,
  popperStyle: {},
  trigger: 'click',
  anchorProps: {},
  keepMounted: false,
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
