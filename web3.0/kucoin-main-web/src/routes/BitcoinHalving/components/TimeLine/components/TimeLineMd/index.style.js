/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ArrowWrapper = styled.div`
  position: relative;
  width: 16px;
  height: 656px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ArrowLine = styled.div`
  flex: 1;
  width: 16px;
  font-size: 0px;
  background: linear-gradient(180deg, rgba(1, 188, 134, 0) 0%, rgba(1, 188, 134, 0.4) 13%);
  padding-top: 87px;
  padding-bottom: 130px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 30px;
    padding-bottom: 120px;
  }
`;

export const Point = styled.img`
  height: 16px;
`;

export const PointNow = styled.img`
  width: 24px;
  margin-left: -4px;
`;

export const Triangle = styled.div`
  width: 0px;
  height: 0px;
  border-top: 22px solid rgba(1, 188, 134, 0.4);
  border-left: 19px solid transparent;
  border-bottom: 22px solid transparent;
  border-right: 19px solid transparent;
`;

export const PointWrapper = styled.span`
  display: inline-block;
  position: relative;
`;

export const TooltipWrapper = styled.div`
  position: absolute;
  display: inline-block;
  top: ${({ now }) => (now ? '-10px' : '-30px')};
  margin-left: ${({ left }) => (left ? '-20px' : '40px')};
  transform: ${({ left }) => (left ? 'translateX(-100%)' : 'translateX(0)')};
  width: ${({ width }) => width}px;
`;

export const TipArrowNow = styled.img`
  width: 16px;
  height: 10px;
  position: absolute;
  right: -12px;
  transform: rotateZ(90deg);
`;

export const TipArrowRight = styled.img`
  width: 16px;
  height: 10px;
  position: absolute;
  top: 30px;
  left: -12px;
  transform: rotateZ(90deg);
`;

export const TipArrow = styled.img`
  width: 16px;
  height: 10px;
  position: absolute;
  right: -12px;
  transform: rotateZ(-90deg);
`;
