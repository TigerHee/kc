/**
 * Owner: victor.ren@kupotech.com
 */
import { variant } from 'styled-system';
import styled from 'emotion/index';

export const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.fonts.family};
  border-radius: 8px;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};
  ${({ variant: variantType, theme }) =>
    variant({
      prop: 'variantType',
      variants: {
        default: {
          background: 'transparent',
        },
        filled: {
          background: theme.colors.cover4,
        },
      },
    })({ variantType })}
  ${({ controls, controlExpand }) => {
    if (controlExpand) return;
    return variant({
      prop: 'size',
      variants: {
        small: {
          padding: `0 ${controls ? '44px' : '8px'} 0 8px`,
        },
        medium: {
          padding: `0 ${controls ? '44px' : '12px'} 0 12px`,
        },
        large: {
          padding: `0 ${controls ? '48px' : '16px'} 0 16px`,
        },
        xlarge: {
          padding: `0 ${controls ? '48px' : '16px'} 0 16px`,
        },
      },
    });
  }}
`;

export const Input = styled.input`
  width: 100%;
  flex: 1;
  border: none;
  outline: none;
  padding: 0;
  font-family: ${({ theme }) => theme.fonts.family};
  background: transparent;
  color: ${({ theme, disabled }) => theme.colors[disabled ? 'text60' : 'text']};
  text-align: ${(props) => (props.controlExpand ? 'center' : 'left')};
  font-weight: 500;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: '12px',
        height: '32px',
      },
      medium: {
        fontSize: '14px',
        height: '40px',
      },
      large: {
        fontSize: '16px',
        height: '48px',
      },
      xlarge: {
        fontSize: '16px',
        height: '56px',
      },
    },
  })}
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
`;

export const ControlsRoot = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        right: '4px',
        top: '-0.74px',
      },
      medium: {
        right: '4px',
      },
      large: {
        right: '8px',
      },
      xlarge: {
        right: '8px',
      },
    },
  })}
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        padding: '4px 0',
      },
      medium: {
        padding: '4px 0',
      },
      large: {
        padding: '8px 0',
      },
      xlarge: {
        padding: '8px 0',
      },
    },
  })}
`;

export const ControlItem = styled.div`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.cover4};
  &:hover {
    background: ${({ theme }) => theme.colors.cover8};
  }
  &:active {
    background: ${({ theme }) => theme.colors.cover12};
  }
  color: ${({ theme }) => theme.colors.icon};
  cursor: pointer;
  width: 24px;
  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }
  &:last-of-type {
    margin-top: 2px;
    border-radius: 0 0 4px 4px;
  }
`;

export const Unit = styled.div`
  color: ${({ theme, disabled }) => theme.colors[disabled ? 'text60' : 'text']};
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: '12px',
        marginLeft: '4px',
      },
      medium: {
        fontSize: '14px',
        marginLeft: '4px',
      },
      large: {
        fontSize: '16px',
        marginLeft: '8px',
      },
      xlarge: {
        fontSize: '16px',
        marginLeft: '8px',
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
        medium: {
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

const InputAddon = styled.div`
  position: absolute;
  cursor: pointer;
  top: 20px;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        top: '8px',
        transform: 'scale(0.8)',
      },
      medium: {
        top: '12px',
      },
      large: {
        top: '16px',
      },
      xlarge: {
        top: '20px',
        transform: 'scale(1.3)',
      },
    },
  })}
`;

export const InputAdd = styled(InputAddon)`
  right: 18px;
`;

export const InputSub = styled(InputAddon)`
  left: 18px;
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
  border-color: ${({ theme, error, isFocus, variant: variantType }) => {
    return error
      ? theme.colors.secondary
      : isFocus
      ? theme.colors.textPrimary
      : variantType === 'filled'
      ? 'transparent'
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
      medium: {
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
