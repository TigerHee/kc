/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import './index.less';

// --- 样式start ---

export const Index = styled.section`
  width: 100%;
  position: relative;
  height: 385px;
`;

export const Slogan = styled.section`
  margin-top: 112px;
  font-size: 14px;
  padding-left: 24px;
  // [dir='rtl'] & {
  //   padding-left: unset;
  //   padding-right: 24px;
  // }
`;

export const Logo = styled.img`
  width: 70px;
  height: 18px;
  margin-bottom: 24px;
`;

export const Title = styled.h3`
  max-width: 280px;
  font-weight: 700;
  font-size: 28px;
  line-height: 130%;
  margin: 0;
  padding: 0;
  color: #ffffff;
  word-break: break-word;
  & > span > span {
    display: ${props => (props.needBreak ? 'block' : 'inline')};
    margin: 0;
    padding: 0;
    background: linear-gradient(92.32deg, #fcff53 4.38%, #f7c84f 99.11%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    mix-blend-mode: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 42px;
  }
`;

export const SubTitle = styled.div`
  width: 158px;
  margin: 0;
  padding: 0;
  background: linear-gradient(92.32deg, #fcff53 4.38%, #f7c84f 99.11%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  mix-blend-mode: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 130%;
  margin-top: 8px;
`;

export const Dec = styled.ul`
  width: 200px;
  margin-top: 24px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  li {
    :not(:last-child) {
      margin-bottom: 4px;
    }
    margin-left: -8px;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;

    color: #ffffff;

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const Share = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 8px;
  cursor: pointer;
`;

// --- 样式end ---
