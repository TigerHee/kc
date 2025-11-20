/*
 * Owner: tom@kupotech.com
 */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { styled } from '@kux/mui';

const Wrapper = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  transition: opacity 200ms ease-in-out, visibility 200ms ease-in-out;
  ${(props) =>
    props.visible ? `visibility: visible; opacity: 1;` : `visibility: hidden; opacity: 0;`}

  [dir='rtl'] & {
    left: unset;
    right: 0;
  }
`;

const Dropdown = forwardRef(({ overlay, children, onVisibleChange }, ref) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
    onVisibleChange && onVisibleChange(true);
  };

  const handleClose = () => {
    setVisible(false);
    onVisibleChange && onVisibleChange(false);
  };

  useImperativeHandle(ref, () => ({ handleClose }));

  return (
    <Wrapper onMouseLeave={handleClose}>
      <div onMouseEnter={handleOpen}>{children}</div>
      <Overlay visible={visible}>{overlay}</Overlay>
    </Wrapper>
  );
});

export default Dropdown;
