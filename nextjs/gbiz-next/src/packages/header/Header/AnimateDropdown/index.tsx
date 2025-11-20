import React, { useState, FC, type CSSProperties, useRef } from 'react';
import { Dropdown } from '@kux/design';
import clsx from 'clsx';
import styles from './styles.module.scss';

interface DropdownWithAnimateProps {
  children: React.ReactNode;
  inDrawer?: boolean;
  overlay: React.ReactNode;
  visible?: boolean;
  trigger: 'click' | 'hover';
  keepMounted?: boolean;
  placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom';
  className?: string;
  anchorProps: { style: CSSProperties };
  onVisibleChange?: (visible: boolean) => void;
  style?: CSSProperties;
  popperStyle?: CSSProperties;
  popperClassName?: string;
  disablePortal?: boolean;
}

const DropdownWithAnimate: FC<DropdownWithAnimateProps> = ({
  children,
  inDrawer,
  overlay,
  // trigger = 'click',
  onVisibleChange,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Dropdown
      {...props}
      overlay={
        <div
          ref={ref}
          className={clsx({
            [styles.animateOverlayVisible]: !inDrawer && visible,
            [styles.animateOverlayUnVisible]: !inDrawer && !visible,
          })}
        >
          {overlay}
        </div>
      }
      visible={visible}
      onVisibleChange={show => {
        setVisible(show);
        onVisibleChange && onVisibleChange(show);
      }}
    >
      {children}
    </Dropdown>
  );
};

export default DropdownWithAnimate;
