/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from 'helper';

import { PAGE_PADDING_WIDTH, SPLITER_WIDTH, CONTENT_WIDTH } from '../config';

export const Wrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
  background-color: black;
`;

export const Page = styled.div`
  width: 100%;
  /* height: 100vh; */
  /* overflow-y: auto; */
  background-color: #fff;
  @media (min-width: ${SPLITER_WIDTH}px) {
    margin: 0 auto;
    max-width: ${CONTENT_WIDTH}px;
    ::-webkit-scrollbar {
      background: transparent;
      width: 2px;
      height: 2px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: rgba(0, 20, 42, 0.2);
    }
  }
`;

export const CupMain = styled.div`
  width: calc(100% - ${PAGE_PADDING_WIDTH * 2}px);
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export const BlockAnchor = styled.div`
  position: absolute;
  top: -${props => (props.isInApp ? px2rem(102) : px2rem(60))};
  width: 1px;
  height: 1px;
  background-color: red;
  visibility: hidden;
`;

export const GreenBorderBox = styled.div`
  position: relative;
  border: 1px solid #51eaac;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
`;

// RaceTimeCard是fixed布局，所以文档流需要个占位的box防止内容被遮挡
export const RaceTimeCardOccupy = styled.div`
  height: 166px;
  /* padding: 22px 16px 0; */
  /* padding-bottom: constant(safe-area-inset-bottom); */
  /* padding-bottom: env(safe-area-inset-bottom); */
`;
