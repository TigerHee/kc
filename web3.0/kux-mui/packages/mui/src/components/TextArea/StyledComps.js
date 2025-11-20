/**
 * Owner: victor.ren@kupotech.com
 */
import MuiDivider from 'components/Divider';
import styled from 'emotion/index';
import { variant } from 'styled-system';
import TextArea from './TextAreaAutosize';

// 输入框
export const StyledInput = styled(TextArea)`
   border: none;
   outline: none;
   padding: 0;
   width: 100%;
   flex: 1;
   margin: 0;
   box-sizing: border-box;
   background: transparent;
   -webkit-tap-highlight-color: transparent;
   font-family: ${({ theme }) => theme.fonts.family};
   color: ${({ theme, disabled }) => theme.colors[disabled ? 'text40' : 'text']};
   cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};
   ${variant({
     prop: 'size',
     variants: {
       small: {
         fontSize: '12px',
         padding: '6px 0',
         lineHeight: '20px',
       },
       middle: {
         fontSize: '14px',
         padding: '10px 0',
         lineHeight: '22px',
       },
       large: {
         padding: '14px 0',
         fontSize: '16px',
         lineHeight: '24px',
       },
       xlarge: {
         padding: '15px 0',
         fontSize: '16px',
         lineHeight: '26px',
       },
     },
   })}
   &:-webkit-autofill {
     -webkit-transition-delay: 99999s;
   }
   &:-webkit-autofill:hover {
     -webkit-transition-delay: 99999s;
   }
   &:-webkit-autofill:focus {
     -webkit-transition-delay: 99999s;
   }
   &:-webkit-autofill:active {
     -webkit-transition-delay: 99999s;
   }
   &:focus {
     outline: none;
   }
   &::-webkit-input-placeholder {
     /* Chrome/Opera/Safari */
     color: ${({ theme }) => theme.colors.text40};
     font-family: ${({ theme }) => theme.fonts.family};
   }
   &::-moz-placeholder {
     /* Firefox 19+ */
     color: ${({ theme }) => theme.colors.text40};
     font-family: ${({ theme }) => theme.fonts.family};
   }
   &:-ms-input-placeholder {
     /* IE 10+ */
     color: ${({ theme }) => theme.colors.text40};
     font-family: ${({ theme }) => theme.fonts.family};
   }
   &:-moz-placeholder {
     /* Firefox 18- */
     color: ${({ theme }) => theme.colors.text40};
     font-family: ${({ theme }) => theme.fonts.family};
   }
   resize: none;
   scrollbar-width: none;
   &::-webkit-scrollbar {
    display: none;
  },
 `;

// 输入框容器
export const InputContainer = styled.div`
  position: relative;
  font-family: ${({ theme }) => theme.fonts.family};
  background: transparent;
  outline: none;
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};
  ${variant({
    prop: 'size',
    variants: {
      small: {
        padding: '0 8px',
      },
      middle: {
        padding: '0 12px',
      },
      large: {
        padding: '0 14px',
      },
      xlarge: {
        padding: '0 16px',
      },
    },
  })}
`;

// suffix和prefix的容器
export const SuffixContainer = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  display: inline-flex;
  align-items: center;
  margin-right: ${(props) => (props.prefix ? '8px' : '0')};
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      middle: {
        fontSize: '14px',
        lineHeight: '22px',
      },
      large: {
        fontSize: '14px',
        lineHeight: '24px',
      },
      xlarge: {
        fontSize: '16px',
        lineHeight: '26px',
      },
    },
  })}
`;

export const AddonContainer = styled.div`
  display: inline-flex;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      middle: {
        fontSize: '14px',
        lineHeight: '22px',
      },
      large: {
        fontSize: '14px',
        lineHeight: '24px',
      },
      xlarge: {
        fontSize: '16px',
        lineHeight: '26px',
      },
    },
  })}
`;

// 清空按钮的容器
export const ClearIconContainer = styled.div`
  margin-left: 12px;
  width: ${({ fontSize }) => fontSize}px;
  height: ${({ fontSize }) => fontSize}px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  -webkit-touch-callout: none;
  &:hover {
    opacity: 0.7;
  }
`;

// 展示密码按钮的容器
export const ShowPwdIconContainer = styled.div`
  margin-left: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

export const LabelContainer = styled.label`
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: left top;
  padding: 0 2px;
  white-space: nowrap;
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  ${({ shrink }) => {
    return variant({
      prop: 'size',
      variants: {
        small: {
          fontSize: '12px',
          lineHeight: '16px',
          transform: shrink ? 'translate(14px, -5px) scale(0.75)' : 'translate(14px, 8px) scale(1)',
        },
        middle: {
          fontSize: '14px',
          lineHeight: '18px',
          transform: shrink
            ? 'translate(14px, -7px) scale(0.75)'
            : 'translate(14px, 10px) scale(1)',
        },
        large: {
          fontSize: '16px',
          lineHeight: '22px',
          transform: shrink
            ? 'translate(14px, -7px) scale(0.75)'
            : 'translate(14px, 12px) scale(1)',
        },
        xlarge: {
          fontSize: '16px',
          lineHeight: '24px',
          transform: shrink
            ? 'translate(14px, -9px) scale(0.75)'
            : 'translate(14px, 16px) scale(1)',
        },
      },
    });
  }}
  color: ${({ theme, error, isFocus, disabled }) => {
    if (error) return theme.colors.secondary;
    if (disabled) return theme.colors.text40;
    return isFocus ? theme.colors.textPrimary : theme.colors.text;
  }};
  pointer-events: none;
`;

export const Divider = styled(MuiDivider)`
  margin: 0 4px;
  background: ${(props) => (props.show ? props.theme.colors.divider8 : 'transparent')};
`;

export const LabelFieldSet = styled.fieldset`
  position: absolute;
  top: -5px;
  left: -2px;
  right: -2px;
  bottom: 0;
  pointer-events: none;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme, error, isFocus }) => {
    return error
      ? theme.colors.secondary
      : isFocus
      ? theme.colors.textPrimary
      : theme.colors.cover12;
  }};
  overflow: hidden;
`;

export const LabelLegend = styled.legend`
  visibility: hidden;
  height: 12px;
  font-size: 14px;
  line-height: 24px;
  max-width: ${(props) => (props.shrink ? '100%' : '0.01px')};
  padding: ${(props) => (props.shrink && props.label ? '2px' : '0')};
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: 11,
      },
      middle: {
        fontSize: 12,
      },
      large: {
        fontSize: 12,
      },
      xlarge: {
        fontSize: 12,
      },
    },
  })}
`;
