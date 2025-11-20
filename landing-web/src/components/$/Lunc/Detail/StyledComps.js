/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';

// --- 样式start ---
export const Index = styled.section`
  position: relative;
  margin: 0 16px;
  border-color: #21C397;
  border-style: solid;
  border-width: 2px 8px 2px 2px;
  display: flex;
  flex-direction: column;
  background: rgba(33, 195, 151, 0.06);
`;

export const DetailHeader = styled.div`
  width: 100%;

  background: rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid #21C397;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  span {
    padding: 29px 0 16px 0;
    text-align: center;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: #ffffff;
    opacity: 0.4;
  }
`;

export const DetailBody = styled.div`
  width: 100%;
  padding: 24px;
  h3 {
    margin-bottom: 12px;
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 130%;
    text-align: start;

    color: #ffffff;

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  p {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    /* or 18px */
    color: rgba(255, 255, 255, 0.6);
    text-align: start;
  }
`;

export const DetailFooter = styled.div`
  height: 45px;
  width: 100%;
  border-top: 2px solid #21C397;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  button {
    flex: 0 0 50%;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #21C397;
    border: none;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
    color: #ffffff;
    cursor: pointer;
  }
  .shareBtn {
    background: rgba(33, 195, 151, 0.06);
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
const videoHeight = '163px';
export const VideoWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  height: ${videoHeight};
  min-height: ${videoHeight};
  overflow: hidden;
  background: rgba(0, 0, 0, 0.9);
  video {
    width: 100%;
    height: ${videoHeight};
    object-fit: cover;
  }
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: ${videoHeight};
    background: rgba(0, 0, 0, 0.9);
  }
`;

// --- 样式end ---
