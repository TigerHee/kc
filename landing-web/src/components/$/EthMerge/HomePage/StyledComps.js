/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { ReactComponent as Star } from 'assets/eth-merge/star.svg';
import './index.less';

// --- 样式start ---

export const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
`;

export const HeaderWrapper = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: ${props => (props.isSticky ? '0' : '44px')};
  z-index: 999;

  height: ${props => (props.isSticky ? '88px' : '44px')};
  display: flex;
  align-items: ${props => (props.isSticky ? 'flex-end' : 'center')};
  justify-content: space-between;
  padding: 10px 12px;

  ${props =>
    props.isSticky &&
    `
    background: #00142AE5;
  `}
`;

export const Share = styled.img`
  width: 24px;
  height: 24px;
  margin-left: 16px;
  cursor: pointer;
`;

export const StarIcon = styled(Star)`
  position: absolute;
  opacity: 0;
  animation: shine 1s infinite;
  @keyframes shine {
    0% {
      opacity: 1;
      transform: scale(0, 0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(1, 1);
    }
  }
`;

// --- 样式end ---
