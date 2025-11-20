/*
 * owner: Borden@kupotech.com
 */
import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import Tooltip from '@mui/Tooltip';

const Container = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const TooltipOver = React.memo((props) => {
  const textRef = useRef(null);
  const { className, style, children, disabled, maxWidth, ...otherProps } = props;

  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (
      !disabled &&
      textRef.current &&
      textRef.current.offsetWidth < textRef.current.scrollWidth
    ) {
      setIsOverflowing(true);
    }
  }, []);

  const dom = (
    <Container
      ref={textRef}
      className={className}
      style={{ maxWidth, ...style }}
    >
      {children}
    </Container>
  );

  return isOverflowing ? (
    <Tooltip title={children} placement="bottom" {...otherProps}>
      {dom}
    </Tooltip>
  ) : dom;
});

export default TooltipOver;
