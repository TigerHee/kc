/**
 * Owner: John.Qi@kupotech.com
 */
import styled from '@emotion/styled';
import { ICArrowLeft2Outlined } from '@kux/icons';

export const ArrowRight = styled(ICArrowLeft2Outlined)`
  width: 24px;
  height: 24px;
  transform: rotateY(180deg);
  flex-shrink: 0;
  [dir='rtl'] & {
    transform: rotateY(0deg);
  }
`;

export const ArrowRight2 = styled(ICArrowLeft2Outlined)`
  width: 24px;
  height: 24px;
  transform: rotateY(180deg);
`;

export const ArrowLeft2 = styled(ICArrowLeft2Outlined)`
  width: 24px;
  height: 24px;
`;
