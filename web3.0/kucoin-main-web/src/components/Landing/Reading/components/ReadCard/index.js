/**
 * Owner: ella.wang@kupotech.com
 */
import React from 'react';
import { ICArrowRight2Outlined } from '@kux/icons';
import { Wrapper, InfoWrapper, Image, Title, Description, ArrowRight } from './index.style';

export default ({ url, title, description, icon }) => {
  return (
    <Wrapper href={url} target="_blank">
      <InfoWrapper>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <ArrowRight className="mining_pool_arrow_right">
          <ICArrowRight2Outlined size={20} />
        </ArrowRight>
      </InfoWrapper>
      <Image src={icon} />
    </Wrapper>
  );
};
