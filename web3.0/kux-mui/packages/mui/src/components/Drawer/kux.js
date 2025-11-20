import styled from 'emotion/index';
import { variant, color, space, border, typography, layout } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';

export const DrawerMask = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: ${(props) => props.theme.colors.mask};
  z-index: ${(props) => props.theme.zIndices.modal};
  transition: opacity 0.3s ease-in;
  ${(props) => {
    return {
      opacity: props.show ? 1 : 0,
      pointerEvents: props.show ? 'auto' : 'none',
    };
  }}
`;

const DrawerBase = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  background: ${(props) => props.theme.colors.layer};
  transition-duration: ${(props) => (props.show ? 0.27 : 0.23)}s;
  transition-timing-function: ${(props) =>
    props.show ? props.theme.animate.easeOut : props.theme.animate.easeIn};
  transition-property: all;
`;

export const DrawerRoot = styled(DrawerBase, {
  shouldForwardProp,
})(
  (props) =>
    variant({
      prop: 'anchor',
      variants: {
        right: {
          right: 0,
          top: 0,
          bottom: 0,
          minWidth: '320px',
          transform: props.show ? 'translateX(0)' : 'translateX(100%)',
        },
        left: {
          left: 0,
          top: 0,
          bottom: 0,
          minWidth: '320px',
          transform: props.show ? 'translateX(0)' : 'translateX(-100%)',
        },
        top: {
          left: 0,
          top: 0,
          right: 0,
          minHeight: '320px',
          transform: props.show ? 'translateY(0)' : 'translateY(-100%)',
        },
        bottom: {
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: '320px',
          transform: props.show ? 'translateY(0)' : 'translateY(100%)',
        },
      },
    }),
  color,
  space,
  border,
  typography,
  layout,
);

export const ModalContent = styled.div`
  flex: 1;
  overflow: auto;
`;
