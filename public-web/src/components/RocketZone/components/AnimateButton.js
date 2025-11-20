/**
 * Owner: jessie@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import { memo } from 'react';
import light from 'static/rocket_zone/light.png';

const ButtonWrapper = styled(Button)`
  /* 定义消失动画的关键帧 */
  @keyframes move {
    0% {
      transform: translate3d(-30px, 0, 0);
    }
    33% {
      transform: translate3d(100%, 0, 0);
    }
    100% {
      transform: translate3d(100%, 0, 0);
    }
  }

  position: relative;
  overflow: hidden;
  .light {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${light}) no-repeat;
    background-position-x: left;
    background-size: cover;
    animation: move 3s ease-out infinite;
    will-change: transform;
  }
`;

function AnimateButton({ children, ...rest }) {
  return (
    <ButtonWrapper {...rest}>
      <div className="light" />
      {children}
    </ButtonWrapper>
  );
}

export default memo(AnimateButton);
