import styled, { keyframes } from 'emotion/index';
import { variant } from 'styled-system';

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SpinRoot = styled.div((props) => {
  return {
    position: 'relative',
    display: 'block',
    alignSelf: 'baseline',
    ...(!props.isNestedPattern &&
      variant({
        prop: 'size',
        variants: {
          basic: {
            width: '64px',
            height: '64px',
          },
          small: {
            width: '40px',
            height: '40px',
          },
          xsmall: {
            width: '32px',
            height: '32px',
          },
        },
      })({ size: props.size })),
    ...(!props.isNestedPattern &&
      variant({
        prop: 'type',
        variants: {
          normal: {
            width: '24px',
            height: '24px',
          },
        },
      })({ type: props.type })),
  };
});

export const SpinBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate3d(-50%, -50%, 0);
  [dir='rtl'] & {
    transform: translate3d(50%, -50%, 0);
  }
  ${variant({
    prop: 'size',
    variants: {
      basic: {
        width: 64,
        height: 64,
      },
      small: {
        width: 40,
        height: 40,
      },
      xsmall: {
        width: 32,
        height: 32,
      },
    },
  })};
  ${variant({
    prop: 'type',
    variants: {
      normal: {
        width: 24,
        height: 24,
      },
    },
  })};
`;

export const StyledContainer = styled.div(
  {
    position: 'relative',
    clear: 'both',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9,
      opacity: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    },
  },
  (props) => {
    const otherStyle = {
      userSelect: 'none',
      pointerEvents: 'none',
      '&::after': {
        opacity: 1,
        pointerEvents: 'auto',
        background: props.theme.colors.overlay60,
      },
    };
    return {
      ...(props.spinning ? { ...otherStyle } : {}),
    };
  },
);

export const CircleCircle = styled.img`
  animation: ${loading} 1.5s linear infinite;
  ${variant({
    prop: 'size',
    variants: {
      basic: {
        width: 64,
        height: 64,
      },
      small: {
        width: 40,
        height: 40,
      },
      xsmall: {
        width: 32,
        height: 32,
      },
    },
  })};
`;

export const CircleLogo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${variant({
    prop: 'size',
    variants: {
      basic: {
        width: 24.51,
        height: 26.4,
      },
      small: {
        width: 15.32,
        height: 16.5,
      },
      xsmall: {
        width: 12.26,
        height: 13.2,
      },
    },
  })};
`;

export const NormalLoading = styled.img`
  width: 24px;
  height: 24px;
  animation: ${loading} 1.5s linear infinite;
`;
