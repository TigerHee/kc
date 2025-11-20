/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { ListItem, Dot, Content, Description } from './index.style';

export default ({ description }) => {
  return (
    <ListItem>
      <Dot />
      <Content>
        <Description>{description}</Description>
      </Content>
    </ListItem>
  );
};
