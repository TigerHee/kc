/**
 * Owner: mike@kupotech.com
 */
import React, { useLayoutEffect } from 'react';
import Slide from '@kux/mui/Slide';
import { isRTLLanguage } from 'utils/langTools';
import styled from '@emotion/styled';
import { css } from '@emotion/css';

const FloatPage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.overlay};
  .side-drawer-order-form-box,
  .bot-create-float-wrapper & {
    background-color: ${({ theme }) => theme.colors.layer};
    thead th {
      background: transparent;
    }
  }
  z-index: 99;
`;
const xHidden = css`
  overflow-x: hidden;
`;

export default React.memo(({ children, show }) => {
  const parentBox = React.useCallback(() => document.querySelector('.bot-create-wrapper'), []);
  useLayoutEffect(() => {
    const parent = parentBox();
    if (parent) {
      if (show) {
        parent.classList.add(xHidden);
      }
    }
  }, [show]);

  const removeClass = React.useCallback(() => {
    const parent = parentBox();
    if (parent) {
      parent.classList.remove(xHidden);
    }
  }, []);
  return (
    <Slide
      container={parentBox}
      direction={isRTLLanguage() ? 'right' : 'left'}
      in={show}
      unmountOnExit
      onExited={removeClass}
    >
      <FloatPage>{children}</FloatPage>
    </Slide>
  );
});
