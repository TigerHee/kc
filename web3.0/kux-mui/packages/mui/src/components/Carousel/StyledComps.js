/**
 * Owner: victor.ren@kupotech.com
 */
import styled from 'emotion/index';

export const DotsBox = styled.ul`
  position: absolute;
  bottom: 24px;
  list-style: none;
  display: block;
  text-align: center;
  padding: 0;
  margin: 0;
  width: 100%;
  z-index: 1;
`;

export const DotsItem = styled.li`
  position: relative;
  display: inline-block;
  height: 6px;
  width: ${({ isActive }) => (isActive ? '40px' : '24px')};
  margin: 0 4px;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
  background: ${({ theme, isActive }) => theme.colors[isActive ? 'primary' : 'text20']};
  &:hover {
    background: ${({ theme, isActive }) => theme.colors[isActive ? 'primary' : 'text60']};
  }
  transition: all 0.5s;
`;

export const Arrow = styled.button`
  width: 40px;
  height: 40px;
  outline: none;
  border-radius: 100%;
  overflow: hidden;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  box-shadow: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  &[data-role='prev-button'] {
    left: 24px;
  }
  &[data-role='next-button'] {
    right: 24px;
  }
  z-index: 1;
  &:hover {
    background: ${({ theme }) => theme.colors.cover12};
  }
`;

export const SlickList = styled.div`
  position: relative;
  overflow: hidden;
  display: block;
  margin: 0;
  padding: 0;
  transform: translate3d(0, 0, 0);
  &:focus {
    outline: none;
  }
`;

export const SlickSlider = styled.div`
  position: relative;
  display: block;
  box-sizing: border-box;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -ms-touch-action: pan-y;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
`;

export const SlickTrack = styled.div`
  position: relative;
  left: 0;
  top: 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
  transform: translate3d(0, 0, 0);
  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:after {
    clear: both;
  }
`;

export const SlickSide = styled('div')(({ vertical }) => {
  return {
    float: 'left',
    height: 'auto',
    minHeight: '1px',
    'img': {
      display: 'block',
    },
    ...(vertical && {
      display: 'block',
      height: 'auto',
    }),
  };
});
