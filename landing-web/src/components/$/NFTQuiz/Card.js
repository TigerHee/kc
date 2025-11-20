/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';

const Card = styled.section`
  background: rgba(29, 33, 36, 0.4);
  backdrop-filter: blur(40px);
  border-radius: ${_r(12)};
  padding: ${_r(6)};
`;

export default Card;