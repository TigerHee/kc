/**
 * Owner: victor.ren@kupotech.com
 */
import MuiDivider from 'components/Divider';
import styled from 'emotion/index';
import { variant, color, layout, space, border, typography } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';

// 输入框
export const StyledInput = styled.input`
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
  font-weight: 500;
  ${variant({
    prop: 'size',
    variants: {
      xsmall: {
        fontSize: '12px',
        height: '28px',
        lineHeight: '15.6px',
      },
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
    font-weight: 400;
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    color: ${({ theme }) => theme.colors.text40};
    font-family: ${({ theme }) => theme.fonts.family};
    font-weight: 400;
  }
  &:-ms-input-placeholder {
    /* IE 10+ */
    color: ${({ theme }) => theme.colors.text40};
    font-family: ${({ theme }) => theme.fonts.family};
    font-weight: 400;
  }
  &:-moz-placeholder {
    /* Firefox 18- */
    color: ${({ theme }) => theme.colors.text40};
    font-family: ${({ theme }) => theme.fonts.family};
    font-weight: 400;
  }
  ${layout}
`;

// 输入框容器
export const InputContainer = styled('div', {
  shouldForwardProp,
})(
  ({ size: variantSize, theme, disabled, variant: variantType }) => ({
    position: 'relative',
    fontFamily: theme.fonts.family,
    background: 'transparent',
    outline: 'none',
    width: '100%',
    height: 'fit-content',
    boxSizing: 'border-box',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...variant({
      prop: 'variantSize',
      variants: {
        xsmall: {
          padding: '0 14px',
        },
        small: {
          padding: '0 8px',
        },
        medium: {
          padding: '0 12px',
        },
        large: {
          padding: '0 14px',
        },
        xlarge: {
          padding: '0 16px',
        },
      },
    })({ variantSize }),
    ...variant({
      prop: 'variantType',
      variants: {
        default: {
          background: 'transparent',
        },
        filled: {
          background: theme.colors.cover4,
        },
      },
    })({ variantType, theme }),
    paddingRight: variantSize === 'xsmall' ? '8px' : '16px',
  }),
  color,
  space,
  border,
  layout,
  typography,
);

// suffix和prefix的容器
export const SuffixContainer = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  display: inline-flex;
  align-items: center;
  margin-right: ${(props) => (props.prefix ? '8px' : '0')};
  ${variant({
    prop: 'size',
    variants: {
      xsmall: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      small: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      medium: {
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
      xsmall: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      small: {
        fontSize: '12px',
        lineHeight: '20px',
      },
      medium: {
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
export const ClearIconContainer = styled('div', {
  shouldForwardProp,
})(
  (props) => `
  margin-left: 12px;
  width: ${props.fontSize}px;
  height: ${props.fontSize}px;
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
`,
);

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

export const LabelContainer = styled('label', {
  shouldForwardProp,
})((props) => {
  const color = () => {
    if (props.error) return props.theme.colors.secondary;
    if (props.disabled) return props.theme.colors.text40;
    return props.isFocus ? props.theme.colors.textPrimary : props.theme.colors.text;
  };
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    transformOrigin: 'left top',
    // padding: '0 2px',
    whiteSpace: 'nowrap',
    transition:
      'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    ...variant({
      prop: 'size',
      variants: {
        xsmall: {
          fontSize: '12px',
          lineHeight: '16px',
          transform: props.shrink
            ? 'translate(14.8px, -6px) scale(0.75)'
            : 'translate(14px, 6px) scale(1)',
        },
        small: {
          fontSize: '12px',
          lineHeight: '16px',
          transform: props.shrink
            ? 'translate(14.8px, -6px) scale(0.75)'
            : 'translate(14px, 8px) scale(1)',
        },
        medium: {
          fontSize: '14px',
          lineHeight: '18px',
          transform: props.shrink
            ? 'translate(13.4px, -7px) scale(0.75)'
            : 'translate(14px, 10px) scale(1)',
        },
        large: {
          fontSize: '16px',
          lineHeight: '22px',
          transform: props.shrink
            ? 'translate(14.8px, -9px) scale(0.75)'
            : 'translate(14px, 12px) scale(1)',
        },
        xlarge: {
          fontSize: '16px',
          lineHeight: '24px',
          transform: props.shrink
            ? 'translate(14.6px, -9px) scale(0.75)'
            : 'translate(14px, 16px) scale(1)',
        },
      },
    })(props),
    color: color(),
    pointerEvents: 'none',
    // eslint-disable-next-line no-dupe-keys
  };
});

export const Divider = styled(MuiDivider)`
  margin: 0 4px;
  background: ${(props) => (props.show ? props.theme.colors.divider8 : 'transparent')};
`;

export const LabelFieldSet = styled.fieldset`
  position: absolute;
  top: -6px;
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
  ${variant({
    prop: 'size',
    variants: {
      xsmall: {
        borderRadius: '24px',
      },
    },
  })}
`;

export const LabelLegend = styled.legend`
  visibility: hidden;
  height: 12px;
  font-size: 12px;
  line-height: 24px;
  max-width: ${(props) => (props.shrink ? '100%' : '0.01px')};
  padding: ${(props) => (props.shrink && props.label ? '2px' : '0')};
  ${variant({
    prop: 'size',
    variants: {
      xsmall: {
        fontSize: 9,
      },
      small: {
        fontSize: 9,
      },
      medium: {
        fontSize: 10,
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
