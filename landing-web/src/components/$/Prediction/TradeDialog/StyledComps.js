/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { THEME_COLOR } from '../config';

// --- 样式start ---
export const BodyWrapper = styled.div`
  width: 100%;
  margin-top: ${px2rem(-20)};
`;

export const Tip = styled.div`
  width: 100%;
  color: rgba(0, 20, 42, 0.3);
  .highlight {
    color: ${THEME_COLOR.primary}
  }
`;

export const ChooseBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChooseItem = styled.div`
  width: 100%;
  min-height: ${px2rem(86)};
  display: flex;
  background: #ffffff;
  border: 1px solid rgba(0, 20, 42, 0.12);
  border-radius: 8px;
  margin-top: ${px2rem(12)};
  @media (min-width: 1040px) {
    cursor: pointer;
  }
`;

export const ChooseIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${px2rem(52)};
  background: rgba(0, 20, 42, 0.04);
  margin-right: ${px2rem(4)};
  border-radius: ${px2rem(8)};
  img {
    width: ${px2rem(20)};
    height: ${px2rem(20)};
  }
`;
export const ChooseContent = styled.div`
  width: calc(100% - ${px2rem(60)});
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${px2rem(4)};
  padding-right: ${px2rem(12)};
  color: rgba(0, 20, 42, 0.3);
  .trading-volume {
    width: 100%;
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(16)};
  }
  .highlight {
    display: inline-block;
    margin: ${px2rem(2)};
    font-style: italic;
    font-weight: 800;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(16)};
    color: ${THEME_COLOR.primary}
  }
  .result-text {
    width: 100%;
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
    color: #00142a;
    display: flex;
    align-item: center;
    justify-content: space-between;
  }
`;

export const ChooseGo = styled.img``;

// --- 样式end ---
