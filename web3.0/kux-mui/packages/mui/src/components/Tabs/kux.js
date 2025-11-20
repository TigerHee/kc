import styled from 'emotion/index';
import { variant } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop';
import ScrollbarSize from './ScrollbarSize';

export const TabsRoot = styled.div`
  position: relative;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 48px;
  border-bottom: ${({ variant: variantType, bordered, theme }) =>
    variantType === 'line' && bordered ? `1px solid ${theme.colors.divider8}` : 'none'};
  ${variant({
    prop: 'tabSize',
    variants: {
      xsmall: {
        height: 40,
      },
      small: {
        height: 40,
      },
    },
  })}
  ${({ variant: variantType, theme }) => {
    return variant({
      prop: 'variantType',
      variants: {
        bordered: {
          height: 34,
        },
        slider: {
          display: 'inline-flex',
          height: '36px',
          background: theme.colors.cover4,
          borderRadius: '8px',
        },
      },
    })({ variantType });
  }}
  ${variant({
    prop: 'type',
    variants: {
      text: {
        height: 24,
      },
    },
  })}
  ${({ variant: variantType, tabSize }) => {
    return (
      variantType === 'slider' &&
      variant({
        prop: 'tabSize',
        variants: {
          medium: {
            height: '32px',
          },
        },
      })({ tabSize })
    );
  }}
`;

export const TabsScroller = styled.div(
  {
    position: 'relative',
    display: 'inline-block',
    flex: '1 1 auto',
    whiteSpace: 'nowrap',
    height: '100%',
  },
  ({ ownerState }) => {
    let styles = {};
    if (ownerState.fixed) {
      styles = {
        overflowX: 'hidden',
        width: '100%',
        ...styles,
      };
    }
    if (ownerState.hideScrollbar) {
      styles = {
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Safari + Chrome
        },
        ...styles,
      };
    }
    if (ownerState.scrollableX) {
      styles = {
        overflowX: 'auto',
        overflowY: 'hidden',
        ...styles,
      };
    }
    return styles;
  },
);

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  transition: all 0.3s ease;
  ${({ size: tabSize, variant: variantType }) =>
    variantType === 'bordered'
      ? 'padding-top: 0;'
      : variant({
          prop: 'tabSize',
          variants: {
            xsmall: {
              paddingTop: '11px',
            },
            small: {
              paddingTop: '11px',
            },
            medium: {
              paddingTop: '11px',
            },
            large: {
              paddingTop: '6px',
            },
          },
        })({ tabSize })}
  ${({ variant: variantType }) =>
    variant({
      prop: 'variantType',
      variants: {
        slider: {
          height: '100%',
          padding: '4px',
        },
      },
    })({ variantType })}
`;

export const TabsIndicator = styled.span`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  ${({ size: tabSize }) =>
    variant({
      prop: 'tabSize',
      variants: {
        xsmall: {
          height: 4,
        },
        small: {
          height: 4,
        },
        medium: {
          height: 4,
        },
        large: {
          height: 6,
        },
        xlarge: {
          height: 6,
        },
      },
    })({ tabSize })}
`;

export const IndicatorInner = styled.span`
  background: ${(props) => props.theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  ${variant({
    prop: 'size',
    variants: {
      xsmall: {
        height: 4,
        width: 16,
      },
      small: {
        height: 4,
        width: 16,
      },
      medium: {
        height: 4,
        width: 24,
      },
      large: {
        height: 6,
        width: 32,
      },
      xlarge: {
        height: 6,
        width: 48,
      },
    },
  })}
`;

export const TabsScrollbarSize = styled(ScrollbarSize, {
  shouldForwardProp,
})(() => {
  return {
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  };
});

export const TabScrollButtonRoot = styled('div')(
  ({ direction, theme, size: variantSize, variant: variantType, type }) => ({
    position: 'absolute',
    paddingTop: 4,
    top: 0,
    left: direction === 'left' ? 0 : 'unset',
    right: direction === 'right' ? 0 : 'unset',
    height: variantType === 'bordered' ? 34 : 50,
    display: 'flex',
    justifyContent: direction === 'left' ? 'flex-start' : 'flex-end',
    cursor: 'pointer',
    zIndex: 1,
    color: theme.colors.icon,
    ...variant({
      prop: 'variantSize',
      variants: {
        xsmall: {
          height: 40,
          paddingTop: '12px',
        },
        small: {
          paddingTop: '12px',
          height: 40,
        },
        medium: {
          paddingTop: '14px',
          height: 48,
        },
        large: {
          paddingTop: '8px',
          height: 48,
        },
        xlarge: {
          paddingTop: '4px',
          height: 48,
        },
      },
    })({ variantSize }),
    ...variant({
      prop: 'type',
      variants: {
        text: {
          height: 24,
          paddingTop: '4px',
        },
        normal: {
          height: 24,
          paddingTop: '4px',
        },
      },
    })({ type }),
    '[dir="rtl"] &': {
      left: direction === 'left' ? 'unset' : 0,
      right: direction === 'right' ? 'unset' : 0,
    },
    'svg': {
      zIndex: 1,
    },
  }),
);

export const TabScrollButtonOverlay = styled('div')(({ theme, direction, size }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  pointerEvents: 'none',
  backgroundImage:
    theme.currentTheme === 'light'
      ? direction === 'left'
        ? `
        linear-gradient(
          to left,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 1) 70%
        )
      `
        : `
        linear-gradient(
          to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 1) 70%
        )
      `
      : direction === 'left'
      ? `
        linear-gradient(
          to left,
          rgba(18, 18, 18, 0) 0%,
          rgba(18, 18, 18, 1) 70%
        )
      `
      : `
        linear-gradient(
          to right,
          rgba(18, 18, 18, 0) 0%,
          rgba(18, 18, 18, 1) 70%
        )
      `,
  width: size === 'xsmall' ? 40 : 80,
}));

export const Slider = styled('div')(({ theme, size: variantSize }) => ({
  position: 'absolute',
  width: '0',
  height: '28px',
  top: '4px',
  left: '0',
  borderRadius: '6px',
  background: theme.colors.overlay,
  pointerEvents: 'none',
  ...variant({
    prop: 'variantSize',
    variants: {
      medium: {
        height: '24px',
      },
    },
  })({ variantSize }),
}));
