import React, { useState } from 'react';
import { Dropdown, keyframes, styled } from '@kux/mui';
import clsx from 'clsx';

const ContentZoomIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContentZoomOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(8px);
  }
`;

const AnimateDropdown = styled(Dropdown)`
  .__AnimateOverlay__ {
    animation-duration: ${(props) => (props.visible ? 0.24 : 0.23)}s;
    animation-timing-function: bezier-curve(0.2, 0, 0, 1);
    animation-name: ${(props) => (props.visible ? ContentZoomIn : ContentZoomOut)};
    animation-fill-mode: forwards;
  }
`;

export const AnimateOverlay = styled.div``;

export default function DropdownWithAnimate({
  children,
  inDrawer,
  overlay,
  onVisibleChange,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <AnimateDropdown
      {...props}
      overlay={
        <AnimateOverlay className={clsx({ '__AnimateOverlay__': !inDrawer })}>
          {overlay}
        </AnimateOverlay>
      }
      visible={visible}
      onVisibleChange={(show) => {
        setVisible(show);
        onVisibleChange && onVisibleChange(show);
      }}
    >
      {children}
    </AnimateDropdown>
  );
}
