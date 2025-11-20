/**
 * Owner: chris@kupotech.com
 */

import { Button, styled } from '@kux/mui';

const Buttons = styled.div`
  overflow: hidden;
  position: relative;
  display: inline-block;
  border-radius: 24px;
  padding: 1.5px 0px;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  width: -webkit-fill-available;
  button {
    position: relative;
    z-index: 1;
    width: 100%;
  }
  .border-gradient-bottom {
    position: absolute;
    right: -250%;
    bottom: -11px;
    z-index: 0;
    width: 300%;
    height: 24px;
    border-radius: 24px;
    opacity: 1;
    animation: star-movement-bottom linear infinite alternate;
  }
  .border-gradient-top {
    position: absolute;
    top: -10px;
    left: -250%;
    z-index: 0;
    width: 300%;
    height: 24px;
    border-radius: 24px;
    opacity: 1;
    animation: star-movement-top linear infinite alternate;
  }
  .border-gradient-bottom,
  .border-gradient-top {
    background: radial-gradient(circle, ${({ shineColor }) => shineColor}, transparent 10%);
    animation-duration: 6s;
    will-change: transform;
    -webkit-mask-image: radial-gradient(white, black);
  }

  @keyframes star-movement-bottom {
    0% {
      transform: translate(0%, 0%);
      opacity: 1;
    }
    100% {
      transform: translate(-100%, 0%);
      opacity: 0;
    }
  }

  @keyframes star-movement-top {
    0% {
      transform: translate(0%, 0%);
      opacity: 1;
    }
    100% {
      transform: translate(100%, 0%);
      opacity: 0;
    }
  }
`;

const ShaineButton = ({ children, size, style = {}, onClick, shineColor }) => {
  const { color, background, ...rest } = style;
  return (
    <Buttons style={rest} onClick={onClick} shineColor={shineColor}>
      <div className="border-gradient-top" />
      <div className="border-gradient-bottom" />
      <Button size={size} style={{ color, background }}>
        {children}
      </Button>
    </Buttons>
  );
};

export default ShaineButton;
