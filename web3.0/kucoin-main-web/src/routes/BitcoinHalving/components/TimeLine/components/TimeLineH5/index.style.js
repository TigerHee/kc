/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ArrowWrapper = styled.div`
  position: relative;
  width: 16px;
  height: 780px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-start;
  margin-left: 8px;
`;

export const TipArrowNow = styled.img`
  width: 16px;
  height: 10px;
  position: absolute;
  left: -12px;
  transform: rotateZ(-90deg);
`;

export const TipArrow = styled.img`
  width: 16px;
  height: 10px;
  position: absolute;
  left: -12px;
  top: 30px;
  transform: rotateZ(90deg);
`;
