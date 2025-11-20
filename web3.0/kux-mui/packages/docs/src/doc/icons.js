/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import * as icons from '@kux/icons';
import { Box, useTheme } from '@kux/mui';
import _ from 'lodash';
import Wrapper from './wrapper';

const Doc = () => {
  const theme = useTheme();
  return (
    <Box display="flex" flexWrap="wrap">
      {_.map(icons, (Component, idx) => {
        return (
          <Box width="200px" textAlign="center" mb="20px" key={idx}>
            <Component color='red' key={idx} size="24" />
            <Box color={theme.colors.text}>{Component.displayName}</Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
