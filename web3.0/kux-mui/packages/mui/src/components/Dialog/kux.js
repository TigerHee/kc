import styled, { keyframes } from 'emotion/index';
import { variant } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';

const KcDialogMaskZoomIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const KcDialogMaskZoomOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const KcDialogContentZoomIn = (props) => keyframes`
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.3, 0, 1, 1);
  }
  ${props.theme.animate
    .generateSpringPath(1, 0, 300)
    .map(
      (cur, i, el) => `
    ${(i * 100) / el.length}% {
        transform: translate3d(0, ${cur * 100}px, 0);
      }`,
    )
    .join('')}
`;

const KcDialogContentZoomOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(100px);
  }
`;

// 弹窗
export const DialogRoot = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${(props) => props.theme.zIndices.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: visibility 0.3s
    ${(props) => (props.show ? props.theme.animate.easeOut : props.theme.animate.easeIn)};

  ${(props) => {
    return {
      visibility: props.show ? 'visible' : 'hidden',
    };
  }}
`;
// 蒙层
export const DialogMask = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${(props) => props.theme.colors.mask};
  z-index: ${(props) => props.theme.zIndices.modal};
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1);
  ${(props) => {
    return {
      animationName: props.show ? KcDialogMaskZoomIn : KcDialogMaskZoomOut,
    };
  }}
`;

const InheritHight = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.layer};
  z-index: ${(props) => props.theme.zIndices.modal};
  border-radius: ${(props) => props.theme.radius.large};
  opacity: 0;
  animation-duration: ${(props) => (props.show ? 0.58 : 0.23)}s;
  animation-fill-mode: both;
  position: relative;
  ${(props) => {
    return {
      animationName: props.show ? KcDialogContentZoomIn(props) : KcDialogContentZoomOut,
    };
  }}
`;

// 弹窗Wrapper
export const DialogBody = styled(InheritHight, {
  shouldForwardProp,
})`
  flex: 1;
  margin: auto;
  .KuxModalHeader-root {
    height: 98px;
    .KuxModalHeader-close {
      top: 32px;
    }
  }
  margin: auto 16px;
  .KuxModalHeader-root {
    min-height: 90px;
    height: auto;
    padding: 32px 32px 24px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      min-height: 68px;
      padding: 24px 24px 16px;
      .KuxModalHeader-close {
        top: 24px;
        right: 24px;
      }
    }
    .KuxModalHeader-title {
      font-size: 20px;
      width: calc(100% - 50px);
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxModalFooter-root {
      padding: 20px 24px;
    }
  }
  ${(props) =>
    variant({
      prop: 'size',
      variants: {
        basic: {
          maxWidth: 400,
          [props.theme.breakpoints.down('sm')]: {
            maxWidth: 319,
            '.KuxModalHeader-root': {
              padding: '32px 24px 12px',
            },
            '.KuxModalFooter-root': {
              padding: '20px 24px 32px',
            },
          },
        },
        medium: {
          maxWidth: 520,
        },
        large: {
          maxWidth: 640,
        },
        fullWidth: {
          width: '100%',
        },
      },
    })({ size: props.size })}
`;

// 内容
export const DialogContent = styled.div`
  overflow-y: auto;
  font-size: 16px;
  line-height: 24px;
  scrollbar-width: none;
  padding: 0 32px;
  -ms-overflow-style: none;
  font-family: ${(props) => props.theme.fonts.family};
  &::-webkit-scrollbar {
    display: none;
  }
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 24px;
  }
`;
