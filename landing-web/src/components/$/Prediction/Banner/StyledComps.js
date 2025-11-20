/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { THEME_COLOR } from '../config';
import './index.less';

// --- 样式start ---
export const Index = styled.section`
  width: 100%;
  padding-bottom: ${px2rem(40)};
  position: relative;
  margin-top: ${props => (props.isInApp ? '8pt' : px2rem(32))};
  @media (min-width: 1040px) {
    margin-top: 0;
  }
`;

export const Slogan = styled.section`
  margin-top: ${px2rem(48)};
  font-size: ${px2rem(14)};
  padding-left: ${px2rem(12)};
`;

export const Logo = styled.img`
  width: ${px2rem(70)};
  height: ${px2rem(18)};
  margin-bottom: ${px2rem(24)};
`;

export const Title = styled.h3`
  max-width: 80%;
  font-size: ${px2rem(38)};
  line-height: ${px2rem(42)};
  margin: 0;
  padding: 0;
  margin-bottom: ${px2rem(8)};
  text-transform: uppercase;
  color: #00142a;
  word-break: break-word;
  font-family: Roboto;
  span.break {
    display: ${props => (props.needBreak ? 'block' : 'inline')};
  }
`;

export const Dec = styled.div`
  width: fit-content;
  max-width: calc(100% - ${px2rem(140)});
  padding: ${px2rem(2)} ${px2rem(6)};
  margin: 0;
  font-weight: 500;
  font-size: ${px2rem(20)};
  line-height: ${px2rem(20)};
  background: #00142a;
  color: ${THEME_COLOR.surface};
  border-radius: 4px;
  span {
    display: inline-block;
  }
  img {
    height: ${px2rem(26)};
    margin: 0 ${px2rem(10)};
    transform: scale(1.3) translateY(2px);
    transform-origin: bottom;
    margin-top: -2px;
  }
`;
export const Entrance = styled.div`
  position: absolute;
  bottom: ${px2rem(40)};
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .detail-entrance {
    background: ${THEME_COLOR.background};
    margin-top: ${px2rem(12)};
  }
`;

export const EntranceItem = styled.div`
  padding: ${px2rem(2)} ${px2rem(8)};
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: #00142a;
  border: 1px solid #000000;
  border-right: none;
  border-radius: 24px 0px 0px 24px;
  background: ${THEME_COLOR.background};
  @media (min-width: 1040px) {
    cursor: pointer;
  }
`;

export const Share = styled.img`
  width: ${px2rem(24)};
  height: ${px2rem(24)};
  margin-left: ${px2rem(8)};
  cursor: pointer;
`;

// --- 样式end ---
