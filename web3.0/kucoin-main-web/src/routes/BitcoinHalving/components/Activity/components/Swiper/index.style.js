/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  [dir='rtl'] & {
    direction: rtl;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 0px;
  }
`;

export const Card = styled.a`
  display: inline-block;
  width: ${({ width }) => width}px;
  z-index: ${({ active }) => (active ? '9' : '0')};
  position: relative;
  top: 50%;
  border-radius: 12px;
  [dir='rtl'] & {
    direction: rtl;
  }
  transform: translateY(-50%) ${({ active }) => (active ? 'scale(1.5)' : 'scale(1)')};
  transition: ${({ animate }) => (animate ? 'transform 300ms ease-in-out' : 'none')};
  img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`;
// span:first-child{
//   color:red;
//   position: absolute;
// }
export const Mask = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border-radius: 12px;
  background: ${({ active }) => (active ? 'transparent' : 'rgba(0, 0, 0, 0.40)')};
`;

export const Container = styled.div`
  width: 100%;
  overflow: hidden;
  height: 420px;
  display: inline-block;
  position: relative;
  [dir='rtl'] & {
    direction: rtl;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    height: 330px;
  }
`;

export const CardWrapper = styled.div`
  display: inline-block;
  white-space: nowrap;
  height: 420px;
  position: absolute;
  transition: ${({ animate }) => (animate ? 'left 300ms ease-in-out' : 'none')};
  [dir='rtl'] & {
    direction: rtl;
    transition: ${({ animate }) => (animate ? 'right 300ms ease-in-out' : 'none')};
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    height: 330px;
  }
`;

export const PointerWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  [dir='rtl'] & {
    direction: rtl;
  }
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

export const CardTitle = styled.span`
  color: ${({ active }) => (active ? '#F3F3F3' : 'rgba(243, 243, 243, 0.4)')};
  font-size: 20px;
  font-weight: 700;
  line-height: 130%;
  position: absolute;
  left: 20px;
  bottom: 18px;
  [dir='rtl'] & {
    right: 20px;
    direction: rtl;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    bottom: 12px;
    left: 14px;
    font-size: 12px;
    [dir='rtl'] & {
      right: 14px;
      direction: rtl;
    }
  }
`;

export const Info = styled.span`
  color: rgba(243, 243, 243, 0.6);
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  position: absolute;
  left: 24px;
  bottom: 6px;
  [dir='rtl'] & {
    right: 24px;
    direction: rtl;
  }
  transform: scaleX(1) scaleY(1);
  ${(props) => props.theme.breakpoints.down('lg')} {
    bottom: 2px;
    left: 14px;
    font-size: 10px;
    [dir='rtl'] & {
      right: 14px;
      direction: rtl;
    }
  }
`;
