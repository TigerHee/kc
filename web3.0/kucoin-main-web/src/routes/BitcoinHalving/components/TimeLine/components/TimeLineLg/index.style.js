/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ArrowWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 456px;
`;

export const ArrowLine = styled.div`
  flex: 1;
  height: 16px;
  font-size: 0px;
  background: linear-gradient(90deg, rgba(1, 188, 134, 0) 0%, rgba(1, 188, 134, 0.4) 13%);
  [dir='rtl'] & {
    background: linear-gradient(250deg, rgba(1, 188, 134, 0) 0%, rgba(1, 188, 134, 0.4) 13%);
  }
  padding-left: 87px;
  padding-right: 27%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Point = styled.img`
  height: 16px;
`;

export const PointNow = styled.img`
  height: 24px;
  margin-top: -5px;
`;

export const PointWrapper = styled.span`
  display: inline-block;
  position: relative;
`;

export const TooltipWrapper = styled.div`
  position: absolute;
  transform: ${({ down }) => (down ? 'translateY(0)' : 'translateY(-100%)')};
  display: inline-block;
  margin-top: ${({ down }) => (down ? '35px' : '-20px')};
  left: -15px;
`;

export const Tooltip = styled.div`
  min-width: 260px;
  border-radius: 12px;
  border: ${({ now, border }) =>
    now
      ? '1px dashed rgba(1, 188, 141, 0.60)'
      : border
      ? '1px solid rgba(243, 243, 243, 0.08)'
      : 'none'};
  background: rgba(243, 243, 243, 0.02);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const Title = styled.span`
  color: #f3f3f3;
  font-size: 20px;
  font-weight: 700;
  line-height: 130%;
  text-wrap: nowrap;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 16px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
  }
`;

export const Time = styled.span`
  color: #01bc8d;
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  margin-top: 4px;
  margin-bottom: 16px;
  text-wrap: nowrap;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 8px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 8px;
    font-weight: 400;
    font-size: 12px;
  }
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

export const ItemTitle = styled.span`
  color: rgba(243, 243, 243, 0.4);
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  text-wrap: nowrap;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

export const ItemContent = styled.span`
  color: #f3f3f3;
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  text-wrap: nowrap;
  margin-left: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

export const TipArrow = styled.img`
  width: 16px;
  height: 10px;
  position: absolute;
  bottom: ${({ down }) => (down ? 'auto' : '-9.6px')};
  top: ${({ down }) => (down ? '-9.6px' : 'auto')};
  transform: ${({ down }) => (down ? 'rotateZ(180deg)' : 'rotateZ(0deg)')};
`;

export const TipArrowNow = styled.img`
  width: 16px;
  height: 10px;
  position: absolute;
  top: -8.8px;
`;

export const Triangle = styled.div`
  width: 0px;
  height: 0px;
  border-left: 22px solid rgba(1, 188, 134, 0.4);
  border-top: 19px solid transparent;
  border-right: 22px solid transparent;
  border-bottom: 19px solid transparent;
`;
