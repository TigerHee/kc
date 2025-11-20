/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem  } from '@kufox/mui/utils';

export const TitlePanel = styled.section`
`;

export const TitleOpt = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-weight: 600;
    font-size: ${px2rem(16)};
    line-height: 120%;
  }
  img {
    border: none;
    width: ${px2rem(24)};
    height: ${px2rem(24)};
  }
`;

export const TitleDesc = styled.div`
  font-weight: 400;
  font-size: 14px;
  opacity: 0.4;
  color: #fff;
  margin: ${px2rem(8)} 0 ${px2rem(20)} 0;
`;






