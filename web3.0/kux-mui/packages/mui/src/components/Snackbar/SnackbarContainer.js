/**
 * Owner: victor.ren@kupotech.com
 */
import styled from 'emotion/index';
import { variant } from 'styled-system';
import { positionDistance, zIndex } from './config';

const SnackbarContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  max-height: 100%;
  position: fixed;
  z-index: ${zIndex};
  height: auto;
  width: auto;
  transition: top 300ms ease 0ms, right 300ms ease 0ms, bottom 300ms ease 0ms, left 300ms ease 0ms,
    margin 300ms ease 0ms, max-width 300ms ease 0ms;
  max-width: calc(100% - 80px);
  ${variant({
    prop: 'vertical',
    variants: {
      top: {
        top: `${positionDistance.verticalDistance}px`,
        flexDirection: 'column',
      },
      bottom: {
        top: `${positionDistance.verticalDistance}px`,
        flexDirection: 'column-reverse',
      },
    },
  })};
  ${variant({
    prop: 'horizontal',
    variants: {
      left: {
        left: `${positionDistance.horizontalDistance}px`,
        '[dir="rtl"] &': {
          left: 'unset',
          right: `${positionDistance.horizontalDistance}px`,
        },
      },
      center: {
        left: '50%',
        transform: 'translateX(-50%)',
      },
      right: {
        right: `${positionDistance.horizontalDistance}px`,
        '[dir="rtl"] &': {
          right: 'unset',
          left: `${positionDistance.horizontalDistance}px`,
        },
      },
    },
  })}
`;

export default SnackbarContainer;
