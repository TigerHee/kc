/**
 * Owner: odan.ou@kupotech.com
 */

import styled from '@emotion/styled';
import { Box, useTheme } from '@kux/mui';
import { useResizeObserverBody } from 'hooks';
import { isNull } from 'lodash';
import React from 'react';
import { eScreenStyle, eTheme } from '../utils';

const EmptyRoot = styled.div`
  display: inline-block;
  text-align: center;
  margin: auto;
`;

const Description = styled.div`
  font-size: 24px;
  font-weight: 500;
  line-height: 130%;
  color: ${eTheme('text')};
  margin-bottom: 8px;
  ${eScreenStyle('Max1200')`
    font-size: 20px;
  `}
  ${eScreenStyle('Max768')`
    font-size: 16px;
  `}
`;

const SubDescription = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  color: ${eTheme('text60')};
  ${eScreenStyle('Max768')`
    font-size: 12px;
  `}
`;

// small: {
//   width: '136px',
//   height: '136px',
// },
// large: {
//   width: '180px',
//   height: '180px',
// },

const Image = styled.img`
  display: inline-block;
  max-width: 150px;
  max-height: 150px;
`;

/**
 * 身份核验状态图
 */
const StatusEmpty = React.forwardRef((props, ref) => {
  const { description, subDescription, imgSrc, className, children } = props;
  const theme = useTheme();
  const { screen } = useResizeObserverBody();
  return (
    <EmptyRoot theme={theme} ref={ref} className={className}>
      <Image src={imgSrc} alt="" />
      <Box>
        {isNull(description) ? null : (
          <Description theme={theme} screen={screen}>
            {description}
          </Description>
        )}
        {subDescription && (
          <SubDescription theme={theme} screen={screen}>
            {subDescription}
          </SubDescription>
        )}
      </Box>
      {children}
    </EmptyRoot>
  );
});

export default StatusEmpty;
