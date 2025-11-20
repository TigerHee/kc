/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';

import { SPLITER_WIDTH, CONTENT_WIDTH } from '../config';

export const Wrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
  background-color: #000;
`;

const isDev = process.env.NODE_ENV === 'development'

export const Page = styled.div`
  width: 100%;
  color: #fff;
  background-color: #11151F;
  position: relative;

  ${isDev ? `
  outline: 2px solid orange;

  &::before {
    position: absolute;
    content: 'DEV';
    padding: 1px 3px;
    font-size: 13px;
    background: orange;
    color: #fff;
    right: 0;
    top: 0;
  }
  ` : ''}

  ${props => {
    if (props.isInApp) {
      // iphone 底边距
      return `
        padding-bottom: 15px;
      `
    }
  }}

  /* height: 100vh; */
  /* overflow-y: auto; */

  @media (min-width: ${SPLITER_WIDTH}px) {
    max-width: ${CONTENT_WIDTH}px;
    margin: 0 auto;
    ::-webkit-scrollbar {
      width: 2px;
      height: 2px;
      background: transparent;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 20, 42, 0.2);
      border-radius: 2px;
    }
  }
`;
