/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';
import { NFT_QUIZ_TYPES as TYPES } from 'config';

export const Holder = styled.div`
  width: 100%;
  height: ${({ isInApp }) => isInApp ? '8pt' : _r(92)};
  background: transparent;
`;

export const Content = styled.div`
  height: 100%;
  width: 100%;
  overflow: ${({ viewType }) => {
    if (viewType === TYPES.LEARN) return 'hidden';
    return 'hidden auto';
  }};
  color: #fff;
`;
export const Wrapper = styled.section`
  width: 100%;
  color: #fff;
  padding: ${(props) => {
    if (props.isHis) return `0 ${_r(12)}`;
    return  props.padding ? `0 ${_r(16)}` : 0;
  }};
`;