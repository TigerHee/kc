import styled, { keyframes } from 'emotion/index';
import { color, space, border, layout, typography, variant as sysVariant } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { fade, blendColors } from 'utils/colorManipulator';
import { SpinOutlined } from '@kux/icons';

const ButtonBase = styled('button', {
  shouldForwardProp,
})(
  (props) => `
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: ${props.theme.radius.xlarge};
  outline: none;
  border: none;
  cursor: pointer;
  width: ${props.fullWidth ? '100%' : 'auto'};
  opacity: ${props.disabled ? 0.4 : 1};
  pointer-events: ${props.inLoading || props.disabled ? 'none' : 'auto'};
  font-family: ${props.theme.fonts.family};
`,
  color,
  space,
  border,
  typography,
  layout,
);

export const ButtonRoot = styled(ButtonBase)(
  ({ theme, variant, btnType: color, size, startIcon, endIcon }) => {
    return {
      fontWeight: 700,
      ...sysVariant({
        prop: 'size',
        variants: {
          large: {
            height: '48px',
            fontSize: '16px',
            padding: '0 32px',
            ...(startIcon && {
              padding: '0 32px 0 28px',
            }),
            ...(endIcon && {
              padding: '0 28px 0 32px',
            }),
          },
          basic: {
            height: '40px',
            fontSize: '14px',
            padding: '0 24px',
            ...(startIcon && {
              padding: '0 24px 0 20px',
            }),
            ...(endIcon && {
              padding: '0 20px 0 24px',
            }),
          },
          small: {
            height: '32px',
            fontSize: '14px',
            padding: '0 20px',
          },
          mini: {
            height: '28px',
            fontSize: '12px',
            padding: '0 16px',
          },
        },
      })({ size }),
      // 临时全量替换button为绿色
      ...sysVariant({
        prop: 'variant',
        variants: {
          contained: {
            ...(color === 'primary' && {
              color: theme.colors.textEmphasis,
              background: theme.currentTheme === 'dark' ? theme.colors.primary : theme.colors.cover,
              '&:hover': {
                background:
                  theme.currentTheme === 'dark'
                    ? blendColors(theme.colors.primary, fade('#FFF', 0.04))
                    : blendColors(theme.colors.cover, fade('#FFF', 0.04)),
              },
              '&:active': {
                background:
                  theme.currentTheme === 'dark'
                    ? blendColors(theme.colors.primary, fade(theme.colors.textEmphasis, 0.12))
                    : blendColors(theme.colors.cover, fade(theme.colors.textEmphasis, 0.12)),
              },
            }),
            ...(color === 'default' && {
              color: theme.colors.text,
              background: theme.colors.cover4,
              '&:hover': {
                background: theme.colors.cover8,
              },
              '&:active': {
                background: theme.colors.cover12,
              },
            }),
            ...(color === 'secondary' && {
              color: theme.colors.textEmphasis,
              background: theme.colors.secondary,
              '&:hover': {
                background: blendColors(theme.colors.secondary, fade('#FFF', 0.04)),
              },
              '&:active': {
                background: blendColors(
                  theme.colors.secondary,
                  fade(theme.colors.textEmphasis, 0.12),
                ),
              },
            }),
          },
          outlined: {
            color: theme.colors.text,
            background: 'transparent',
            border: `1px solid ${theme.colors.cover}`,
            '&:hover': {
              background: theme.colors.cover4,
            },
            '&:active': {
              background: theme.colors.cover8,
            },
          },
          text: {
            borderRadius: 'none',
            border: 'none',
            background: 'transparent',
            padding: 0,
            color: theme.colors.text,
            '&:hover': {
              color: theme.colors.primary,
            },
            '&:active': {
              color: theme.colors.textPrimary,
            },
            ...(color === 'secondary' && {
              color: theme.colors.secondary,
              '&:hover': {
                color: theme.colors.secondary,
              },
              '&:active': {
                color: theme.colors.secondary,
              },
            }),
            ...(color === 'brandGreen' && {
              color: theme.colors.primary,
              '&:hover': {
                opacity: 0.8,
              },
              '&:active': {
                opacity: 0.9,
              },
            }),
          },
        },
      })({ variant }),
    };
  },
);

export const TranslateSpin = keyframes`
  0%{
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }
  100%{
    transform: rotate(-360deg);
    -ms-transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
`;

export const LoadingIcon = styled(SpinOutlined)`
  margin-right: 6px;
  animation: ${TranslateSpin} 1s linear infinite;
`;

export const ButtonStartIcon = styled.div`
  margin-right: 6px;
  width: 16px;
  height: 16px;
`;

export const ButtonEndIcon = styled.div`
  margin-left: 6px;
  width: 16px;
  height: 16px;
`;
