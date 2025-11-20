import styled from 'emotion/index';
import { color, space, border, layout, typography } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';

export const ModalHeaderRoot = styled('div', {
  shouldForwardProp,
})(
  (props) => `
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 32px;
  box-sizing: border-box;
  position: relative;
  border-bottom: ${props.border ? `1px solid ${props.theme.colors.divider8}` : 'none'};
  ${props.theme.breakpoints.down('sm')} {
    height: 56px;
    padding: 0 16px;
  }
`,
  color,
  space,
  border,
  typography,
  layout,
);

// 主标题
export const HeaderTitle = styled.div`
  width: calc(100% - 36px);
  font-weight: 700;
  font-size: 24px;
  color: ${(props) => props.theme.colors.text};
  font-family: ${(props) => props.theme.fonts.family};
  word-wrap: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

// 返回按钮
export const HeaderBack = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 2px solid ${(props) => props.theme.colors.cover8};
  z-index: ${(props) => props.theme.zIndices.modal};
  border-radius: 100%;
  [dir='rtl'] & {
    transform: rotate(180deg);
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 28px;
    height: 28px;
    border: none;
  }
  ${(props) => {
    return {
      cursor: props.disabled ? 'not-allowed' : 'pointer',
    };
  }}
`;

// 关闭按钮
export const HeaderClose = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  position: absolute;
  right: 32px;
  top: 23px;
  border: 2px solid ${(props) => props.theme.colors.cover8};
  z-index: ${(props) => props.theme.zIndices.modal};
  border-radius: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 28px;
    height: 28px;
    right: 16px;
    top: 16px;
    border: none;
  }
  ${(props) => {
    return {
      cursor: props.disabled ? 'not-allowed' : 'pointer',
    };
  }}
`;

export const BackSmall = styled.img`
  width: 24x;
  height: 24px;
`;

export const CloseSmall = styled.img`
  width: 24px;
  height: 24px;
`;
