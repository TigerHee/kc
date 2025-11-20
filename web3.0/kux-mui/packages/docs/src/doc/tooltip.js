/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Tooltip, styled } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const SearchIcon = styled(ICSearchOutlined)`
  cursor: help;
`;

const TooltipDoc = () => {
  return (
    <div style={{ position: 'absolute', top: 120, right: 600 }}>
      <Tooltip
        //        placement={'top'}
        trigger="hover"
        title="Dui at cras sit nunc eu volutpat ultricies pellentesque. Dolor urna blandit egestas vel adipiscing nisl pharetra non."
        maxWidth={340}
      >
        <SearchIcon />
      </Tooltip>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <TooltipDoc />
    </Wrapper>
  );
};
