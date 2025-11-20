/**
 * Owner: saiya.lee@kupotech.com
 */
import { styled } from '@kux/mui';
import clsx from 'clsx';

const Wrapper = styled.div`
  position: relative;
  color: #1d1d1d;
  font-size: 12px;
  font-weight: 500;
  background: #d3f475;
  padding: 2px 5px;
  border-radius: 30px;
  line-height: 1.3;
  &::before {
    position: absolute;
    z-index: -1;
    width: 10px;
    height: 10px;
    background: #d3f475;
    border-radius: 2px;
    transform-origin: top center;
    content: '';
  }

  &.arrow-placement-bottom {
    &::before {
      bottom: -8px;
      /* @noflip */
      left: 50%;
      /* @noflip */
      transform: rotate(45deg) translateX(-50%);
    }
  }

  &.arrow-placement-right {
    padding: 0 2px;
    border-radius: 3px;

    &::before {
      top: 50%;
      right: -2px;
      transform: rotate(45deg) translateY(-50%);

      [dir='rtl'] & {
        transform: rotate(-45deg) translateY(-50%);
      }
    }
  }

  &.arrow-placement-bottom-left {
    &::before {
      bottom: -4px;
      left: 18px;
      width: 10px;
      height: 12px;
      border-radius: 3px;
      transform: skew(-60deg) rotate(-40deg);

      [dir='rtl'] & {
        transform: skew(60deg) rotate(40deg);
      }
    }
  }

  &.arrow-placement-top-right {
    &::before {
      top: -6px;
      /* @noflip */
      right: 14px;
      /* @noflip */
      transform: rotate(45deg) translateX(50%);
    }
  }
`;

export function BubbleTip(props) {
  const className = clsx(props.className, `arrow-placement-${props.arrowPlacement || 'bottom'}`);

  return (
    <Wrapper style={props.style} className={className}>
      {props.children}
    </Wrapper>
  );
}
