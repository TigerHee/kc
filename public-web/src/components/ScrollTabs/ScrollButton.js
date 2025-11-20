/**
 * Owner: willen@kupotech.com
 */
import { LeftOutlined, RightOutlined } from '@kufox/icons';
import { styled, useTheme } from '@kufox/mui';
import * as React from 'react';

const ScrollButtonRoot = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.theme.colors.icon};
`;

const ScrollButton = React.forwardRef(function TabScrollButton(props, ref) {
  const { direction, orientation, disabled, ...other } = props;

  const theme = useTheme();

  return (
    <ScrollButtonRoot theme={theme} component="div" ref={ref} tabIndex={null} {...other}>
      {direction === 'left' ? <LeftOutlined size="24" /> : <RightOutlined size="24" />}
    </ScrollButtonRoot>
  );
});

export default ScrollButton;
