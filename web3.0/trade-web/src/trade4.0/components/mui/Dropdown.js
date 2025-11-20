/*
 * owner: Borden@kupotech.com
 */
import React, { forwardRef, useState, useCallback, useMemo, Fragment } from 'react';
import { Dropdown, useResponsive } from '@kux/mui';
import { execMaybeFn, execOneFn } from '@/utils/tools';
import Dialog from './Dialog';

export const HookContext = React.createContext(() => {});

const MDropdown = React.memo(
  ({ overlay, children, forwardedRef, onVisibleChange, ...otherProps }) => {
    const [open, setOpen] = useState(false);

    const onClose = useCallback(() => {
      if (onVisibleChange) {
        onVisibleChange(false);
      }
      setOpen(false);
    }, [onVisibleChange]);

    const onOpen = useCallback(
      (e) => {
        e.stopPropagation();
        if (onVisibleChange) {
          onVisibleChange(true);
        }
        setOpen(true);
      },
      [onVisibleChange],
    );
    return (
      <HookContext.Provider value={setOpen}>
        <span onClick={onOpen}>{children}</span>
        <Dialog open={open} footer={null} onClose={onClose} ref={forwardedRef} {...otherProps}>
          {overlay}
        </Dialog>
      </HookContext.Provider>
    );
  },
);
/**
 * holdDropdown: 强行保持在移动端使用Dropdown
 */
const MuiDropdown = forwardRef(
  (
    {
      visible,
      title,
      holdDropdown,
      height,
      contentPadding,
      popperStyle,
      onVisibleChange = () => {},
      ...otherProps
    },
    ref,
  ) => {
    const { sm } = useResponsive();
    const _onVisibleChange = useCallback(
      (v) => {
        if (v === visible) {
          return;
        }
        onVisibleChange(v);
      },
      [onVisibleChange, visible],
    );
    return sm || holdDropdown ? (
      <Dropdown
        ref={ref}
        visible={visible}
        popperStyle={{ zIndex: 1000, ...popperStyle }}
        onVisibleChange={_onVisibleChange}
        {...otherProps}
      />
    ) : (
      <MDropdown
        back={false}
        title={title}
        height={height}
        forwardedRef={ref}
        contentPadding={contentPadding}
        onVisibleChange={_onVisibleChange}
        {...otherProps}
      />
    );
  },
);

MuiDropdown.defaultProps = {
  height: '90%',
  contentPadding: '0 16px',
};

export default MuiDropdown;

/**
 * Dropdown
 * 在 overlay 中能够关闭弹窗
 * @param {*} props
 */
const DropdownOverlayClose = forwardRef((props, ref) => {
  const { overlay: overlayProp, onVisibleChange: onVisibleChangeProp, ...others } = props;
  const { visible } = others;
  const [open, setOpen] = useState(visible);

  const onVisibleChange = useCallback(
    (status) => {
      return execOneFn(onVisibleChangeProp, setOpen, status);
    },
    [onVisibleChangeProp],
  );

  const onClose = useCallback(() => {
    return onVisibleChange(false);
  }, [onVisibleChange]);

  const overlay = useMemo(() => {
    return execMaybeFn(overlayProp, {
      onClose,
    });
  }, [overlayProp, onClose]);

  return (
    <Dropdown
      visible={open}
      overlay={overlay}
      onVisibleChange={onVisibleChange}
      ref={ref}
      {...others}
    />
  );
});

export { DropdownOverlayClose };
