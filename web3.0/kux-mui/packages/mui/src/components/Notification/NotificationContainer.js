/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import { variant } from 'styled-system';
import { positionDistance } from './config';

const NotificationContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  max-height: 100%;
  position: fixed;
  z-index: ${(props) => props.theme.zIndices.message};
  height: auto;
  transition: top 300ms ease 0ms, right 300ms ease 0ms, bottom 300ms ease 0ms, left 300ms ease 0ms,
    margin 300ms ease 0ms, max-width 300ms ease 0ms;
  width: 327px;
  ${variant({
    prop: 'vertical',
    variants: {
      top: {
        top: `${positionDistance.verticalDistance}px`,
        flexDirection: 'column',
      },
      bottom: {
        bottom: `${positionDistance.verticalDistance}px`,
        flexDirection: 'column-reverse',
      },
    },
  })};
  ${variant({
    prop: 'horizontal',
    variants: {
      left: {
        left: `${positionDistance.horizontalDistance}px`,
      },
      center: {
        left: '50%',
        transform: 'translateX(-50%)',
      },
      right: {
        right: `${positionDistance.horizontalDistance}px`,
      },
    },
  })}
`;

export default React.memo(NotificationContainer);
