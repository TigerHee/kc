/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';

const RowRoot = styled.tr`
  display: table-row;
  outline: 0;
  vertical-align: middle;
  transition: ${(props) =>
    props.theme.transitions.create('all', {
      duration: '0.1s',
    })};
`;

const Row = React.forwardRef((props, ref) => {
  const theme = useTheme();
  return <RowRoot {...props} ref={ref} theme={theme} />;
});

export default Row;
