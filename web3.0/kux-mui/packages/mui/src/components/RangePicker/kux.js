import { RangePicker } from 'rc-picker';
import styled from 'emotion/index';
import { layout, space, variant } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';

export const ContainerWrapper = styled('div', {
  shouldForwardProp,
})`
  width: 240px;
  position: relative;
  ${layout}
  ${space}
  ${variant({
    prop: 'size',
    variants: {
      small: {
        width: '224px',
      },
      medium: {
        width: '246px',
      },
      large: {
        width: '264px',
      },
      xlarge: {
        width: '276px',
      },
    },
  })}
`;

export const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

export const DateWrapper = styled(RangePicker)`
  width: 100%;
  padding-right: 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.overlay};
  transition: all 0.3s;
  padding-left: 16px;
  cursor: pointer;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: '12px',
        height: '32px',
        lineHeight: '20px',
      },
      medium: {
        fontSize: '14px',
        height: '40px',
        lineHeight: '22px',
      },
      large: {
        fontSize: '16px',
        height: '48px',
        lineHeight: '24px',
      },
      xlarge: {
        fontSize: '16px',
        height: '56px',
        lineHeight: '26px',
      },
    },
  })}
  &.KuxPicker-focused {
    border: 1px solid transparent;
    background: ${(props) => props.theme.colors.overlay};
    .KuxPicker-active-bar {
      display: none;
    }
  }
  .KuxPicker-input {
    background: transparent;
    border-radius: 2px;
    transition: all 0.3s;
    ${variant({
      prop: 'size',
      variants: {
        basic: {
          height: 30,
          marginTop: 4,
        },
        large: {
          height: 32,
          marginTop: 7,
        },
      },
    })}
    input {
      outline: none;
      border: none;
      background: transparent;
      text-align: left;
      padding: 0;
      color: ${(props) => props.theme.colors.text};
      caret-color: ${(props) => props.theme.colors.primary};
      font-family: ${(props) => props.theme.fonts.family};
      font-weight: 500;
      &::placeholder {
        color: ${(props) => props.theme.colors.text40};
      }
      ${variant({
        prop: 'size',
        variants: {
          small: {
            fontSize: 12,
            '&::placeholder': {
              fontSize: 10,
            },
          },
          medium: {
            fontSize: 14,
            '&::placeholder': {
              fontSize: 12,
            },
          },
          large: {
            fontSize: 16,
            '&::placeholder': {
              fontSize: 14,
            },
          },
          xlarge: {
            fontSize: 16,
            '&::placeholder': {
              fontSize: 14,
            },
          },
        },
      })}
    }
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
  .KuxPicker-suffix {
    display: flex;
    align-items: center;
    background: transparent;
    svg {
      transition: all 0.3s ease;
    }
  }
  .KuxPicker-clear {
    position: absolute;
    right: 14px;
    width: 12px;
    height: 100%;
    display: flex;
    visibility: hidden;
    align-items: center;
    [dir='rtl'] & {
      left: unset;
      right: 12px;
    }
  }
  &:hover {
    .KuxPicker-suffix {
      visibility: ${(props) => (props.value ? 'hidden' : 'visible')};
      svg {
        transition: ${(props) => (!props.value ? 'all 0.3s ease' : 'unset')};
      }
    }
    .KuxPicker-clear {
      visibility: visible;
    }
  }
  .KuxPicker-range-separator {
    flex-shrink: 0;
    width: 16px;
    margin: 0 8px;
    display: flex;
    align-items: center;
    font-size: 24px;
    color: ${(props) => props.theme.colors.text};
  }
  .KuxPicker-active-bar {
    display: none;
  }
`;

export const ExtraFooter = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  padding: 0 12px 12px;
`;

export const ExtraItem = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text60};
  border-radius: 20px;
  margin-right: 12px;
  cursor: pointer;
  &:last-of-type {
    margin-right: 0;
  }
  &:hover {
    background: ${(props) => props.theme.colors.primary12};
    color: ${(props) => props.theme.colors.primary};
  }
  &.selected {
    background: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
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
