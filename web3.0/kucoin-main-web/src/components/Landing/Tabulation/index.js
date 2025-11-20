/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { ListItem, Num, ContentWrapper, Title, Description } from './index.style';

export default ({ num, title, description }) => {
  return (
    <ListItem>
      <Num>{num}</Num>
      <ContentWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </ContentWrapper>
    </ListItem>
  );
};
