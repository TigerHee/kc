import Picker from 'rc-picker';
import styled from 'emotion/index';
import { variant, layout, space } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';

export const IconContainer = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
`;

export const ContainerWrapper = styled('div', {
  shouldForwardProp,
})`
  width: 138px;
  position: relative;
  ${layout}
  ${space}
`;

export const DateWrapper = styled(Picker)`
  width: 100%;
  border-radius: 8px;
  border: 1px solid transparent;
  .KuxPicker-input {
    background: ${(props) => props.theme.colors.overlay};
    padding-right: 12px;
    border-radius: 8px;
    [dir='rtl'] & {
      direction: ltr;
    }
    input {
      padding-left: 12px;
      outline: none;
      border: none;
      background: transparent;
      color: ${(props) => props.theme.colors.text};
      caret-color: ${(props) => props.theme.colors.textPrimary};
      font-family: ${(props) => props.theme.fonts.family};
      font-weight: 500;
      &::placeholder {
        font-size: 12px;
        color: ${(props) => props.theme.colors.text40};
      }
      [dir='rtl'] & {
        direction: ltr;
      }
      ${variant({
        prop: 'size',
        variants: {
          small: {
            fontSize: '12px',
            height: '32px',
            lineHeight: '20px',
            '&::placeholder': {
              fontSize: 12,
            },
          },
          medium: {
            fontSize: '14px',
            height: '40px',
            lineHeight: '22px',
            '&::placeholder': {
              fontSize: 14,
            },
          },
          large: {
            fontSize: '16px',
            height: '48px',
            lineHeight: '24px',
            '&::placeholder': {
              fontSize: 16,
            },
          },
          xlarge: {
            fontSize: '16px',
            height: '56px',
            lineHeight: '26px',
            '&::placeholder': {
              fontSize: 16,
            },
          },
        },
      })}
    }
    .KuxPicker-suffix {
      display: ${({ allowClear }) => (allowClear ? 'none' : 'flex')};
      align-items: center;
      background: transparent;
    }
    .KuxPicker-clear {
      position: absolute;
      right: 12px;
      width: 14px;
      height: 100%;
      display: flex;
      align-items: center;
      [dir='rtl'] & {
        left: unset;
        right: 12px;
      }
    }
  }
  &.KuxPicker-focused {
    transition: all 0.3s ease;
    border: 1px solid transparent;
    background: transparent;
  }
  &.KuxPicker-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    .KuxPicker-input {
      input {
        cursor: not-allowed;
        &::placeholder {
          color: ${(props) => props.theme.colors.text20};
        }
      }
    }
  }
  ${({ size: variantSize }) =>
    variant({
      prop: 'variantSize',
      variants: {
        small: {
          height: '32px',
        },
        medium: {
          height: '40px',
        },
        large: {
          height: '48px',
        },
        xlarge: {
          height: '56px',
        },
      },
    })({ variantSize })}
`;

export const LabelFieldSet = styled.fieldset`
  position: absolute;
  top: -5px;
  left: -1.5px;
  right: -1.5px;
  bottom: 0.5px;
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
  float: unset;
  width: auto;
  overflow: hidden;
  display: block;
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
        fontSize: 9.8,
        padding: 0,
      },
      medium: {
        fontSize: 11,
        padding: 0,
      },
      large: {
        fontSize: 12.2,
      },
      xlarge: {
        fontSize: 12.3,
      },
    },
  })}
`;

export const LabelContainer = styled.label`
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: left top;
  padding: 0 2px;
  white-space: nowrap;
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  ${({ shrink }) => {
    return variant({
      prop: 'size',
      variants: {
        small: {
          fontSize: '12px',
          lineHeight: '16px',
          transform: shrink
            ? 'translate(14.8px, -6px) scale(0.75)'
            : 'translate(14px, 8px) scale(1)',
        },
        medium: {
          fontSize: '14px',
          lineHeight: '18px',
          transform: shrink
            ? 'translate(13.4px, -7px) scale(0.75)'
            : 'translate(14px, 10px) scale(1)',
        },
        large: {
          fontSize: '16px',
          lineHeight: '22px',
          transform: shrink
            ? 'translate(14.8px, -9px) scale(0.75)'
            : 'translate(14px, 12px) scale(1)',
        },
        xlarge: {
          fontSize: '16px',
          lineHeight: '24px',
          transform: shrink
            ? 'translate(14.6px, -9px) scale(0.75)'
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
