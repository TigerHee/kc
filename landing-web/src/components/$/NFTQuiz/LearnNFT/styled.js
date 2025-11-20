/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r  } from '@kufox/mui/utils';

export const Row = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > p {
    margin-bottom: 0;
  }
`;

export const Title = styled.p`
  font-weight: 600;
  font-size: ${_r(16)};
  line-height: 120%;
  margin-bottom: ${_r(6)};
`;

export const DESC = styled.p`
  font-weight: 400;
  font-size: ${_r(14)};
  line-height: 120%;
  opacity: 0.4;
  margin-bottom: 0;
`;

export const LOGO = styled.img`
  border: none;
  width: ${_r(60)};
  height: ${_r(60)};
  align-self: center;
  margin-left: ${_r(12)};
`;