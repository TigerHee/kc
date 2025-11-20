/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';

export const HeaderWrapper = styled.section`
  width: 100%;
  position: ${({ isFix, mobile }) => isFix && mobile ? 'fixed' : 'relative'};
  z-index: ${({ isFix, mobile }) => isFix && mobile ? '9' : 'unset'};
  background: ${({ isFix, mobile }) => isFix && mobile ? 'rgba(25, 27, 29, 0.9)' : 'unset'};
  margin-top: ${({ isInApp, isFix, mobile }) => {
    if (isFix || !mobile) return 0;
    return isInApp ? '8pt' : px2rem(32);
  }};
  padding-top: ${({ isInApp, isFix, mobile }) => {
    if (!isFix || !mobile) return 0;
    return isInApp ? '8pt' : px2rem(32);
  }};
  transition:  ${({ isFix, mobile }) => isFix && mobile  ? 'background .2s ease-in' : 'unset'};
`;

export const Share = styled.img`
  width: ${px2rem(24)};
  height: ${px2rem(24)};
  margin-left: ${px2rem(8)};
  cursor: pointer;
`;

export const HeaderTitle = styled.span`
  position: relative;
  left: -12px;
  font-weight: 500;
  font-size: ${px2rem(18)};
  line-height: ${px2rem(30)};
  color: #fff;
  justify-self: center;
  margin: 0 auto;
`;