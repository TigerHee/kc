/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Box = styled.div`
  width: 100%;
  position: relative;
  margin-top: 16px;
  .kux-slick-slider {
    .kux-slick-arrow {
      display: none;
    }
  }
`;

export const Dots = styled.div`
  text-align: center;
`;

export const Point = styled.span`
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 50%;
  [dir='rtl'] & {
    direction: rtl;
  }
  background: ${({ active }) => (active ? '#FFF' : 'rgba(243, 243, 243, 0.16)')};
  margin: 0px 6px;
  cursor: pointer;
`;

export const Card = styled.div`
  width: 100%;
  position: relative;
  border-radius: 20px;
  img {
    width: 100%;
    border-radius: 20px;
  }
`;

export const CardTitle = styled.span`
  position: absolute;
  color: #f3f3f3;
  font-size: 16px;
  font-weight: 700;
  line-height: 130%;
  position: absolute;
  bottom: 20px;
  left: 14px;
  [dir='rtl'] & {
    right: 14px;
    direction: rtl;
  }
`;

export const Info = styled.span`
  position: absolute;
  color: rgba(243, 243, 243, 0.6);
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  position: absolute;
  bottom: 6px;
  left: 14px;
  [dir='rtl'] & {
    right: 14px;
    direction: rtl;
  }
`;
