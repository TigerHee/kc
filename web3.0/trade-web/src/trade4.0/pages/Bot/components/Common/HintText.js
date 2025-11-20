/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { MIcons } from './Icon';
import { Text, Div } from '../Widgets';
import Alert from '@mui/Alert';
import styled from '@emotion/styled';

const Box = styled(Div)`
  font-size: 14px;
  .vm {
    vertical-align: middle;
  }
`;
export default React.memo(({ children, simple, className, ...rest }) => {
  if (simple) {
    // 简单模式, 没有背景色
    return (
      <Box {...rest}>
        <MIcons.InfoContained size={16} color="icon60" className="vm" />
        <Text color="text40" pl={4} className={`vm ${className}`}>
          {children}
        </Text>
      </Box>
    );
  }
  return <Alert showIcon type="info" title={children} className={className} {...rest} />;
});
