/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';

const ContainerRoot = styled.div`
  background: transparent;
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: ${props => props.theme.colors.cover8};
  }
`;

const Container = React.forwardRef((props, ref) => {
  const theme = useTheme();
  return <ContainerRoot {...props} theme={theme} ref={ref} />;
});

Container.displayName = 'TableContainer';

export default Container;
