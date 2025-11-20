/**
 * Owner: victor.ren@kupotech.com
 */
import styled, { isPropValid } from 'emotion/index';
import { variant } from 'styled-system';
import {
  getFontSizeFromSize,
  getOptionHeightFromSize,
  getSearchIconSizeFromSize,
  getSearchIconSpaceSizeFromSize,
} from './aux';
import Box from '../Box';

export const SelectContainer = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ fullWidth, theme, error, noStyle, isFocus }) => {
  return {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    margin: 0,
    padding: 0,
    width: fullWidth && !noStyle ? '100%' : 'inherit',
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };
});

export const SelectSelector = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ size, theme, disabled, isLoading, multiple, noStyle }) => {
  return {
    position: 'relative',
    border: 'none',
    outline: 'none',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    width: '100%',
    fontSize: `${getFontSizeFromSize(size)}px`,
    color: theme.colors.text,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : isLoading ? 'progress' : 'pointer',
    ...(!multiple && {
      padding: '0 16px',
      height: `${getOptionHeightFromSize(size)}px`,
      ...(noStyle && {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
      }),
    }),
    ...(multiple && {
      padding: '0 28px 0 4px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
    }),
  };
});

export const SelectItem = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ size, theme, noStyle, showIcon }) => {
  return {
    color: theme.colors.text,
    top: 0,
    bottom: '0',
    left: showIcon ? `${getSearchIconSpaceSizeFromSize(size)}px` : '16px',
    right: '12px',
    position: 'absolute',
    paddingRight: '18px',
    lineHeight: `${getOptionHeightFromSize(size)}px`,
    userSelect: 'none',
    ...(noStyle && {
      position: 'unset',
      paddingRight: '0',
      paddingLeft: '0',
    }),
  };
});

export const StyledPlaceholder = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, size, showIcon }) => {
  return {
    fontSize: 'inherit',
    color: theme.colors.text40,
    fontFamily: theme.fonts.family,
    top: 0,
    bottom: '0',
    left: showIcon ? `${getSearchIconSpaceSizeFromSize(size)}px` : '16px',
    right: '12px',
    position: 'absolute',
    paddingRight: '18px',
    lineHeight: `${getOptionHeightFromSize(size)}px`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
});

export const SingleSelectSearch = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ showIcon, size }) => {
  return {
    position: 'absolute',
    top: 0,
    left: showIcon ? `${getSearchIconSpaceSizeFromSize(size)}px` : '16px',
    right: '40px',
    bottom: 0,
    zIndex: 1,
  };
});

export const StyledSearchPlaceholder = styled.div`
  z-index: 0;
  right: 24px;
  padding-right: 18px;
  position: absolute;
  color: ${({ theme }) => theme.colors.text40};
  left: ${({ showIcon, size }) =>
    showIcon ? `${getSearchIconSpaceSizeFromSize(size)}px` : '16px'};
  top: 0;
  bottom: 0;
  line-height: ${({ size }) => getOptionHeightFromSize(size)}px;
  font-family: ${({ theme }) => theme.fonts.family};
  font-size: inherit;
`;

export const StyledSearchInput = styled('input', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ size, theme, multiple }) => {
  return {
    border: 'none',
    outline: 'none',
    fontSize: `${getFontSizeFromSize(size)}px`,
    background: 'transparent',
    color: theme.colors.text,
    caretColor: theme.colors.primary,
    width: '100%',
    outlineOffset: '-2px',
    height: `${getOptionHeightFromSize(size)}px`,
    lineHeight: `${getOptionHeightFromSize(size)}px`,
    boxSizing: 'border-box',
    ...(!multiple && {
      width: '100%',
    }),
  };
});

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  .ICSearch_svg__icon {
    font-size: ${(props) => getSearchIconSizeFromSize(props.size)}px;
  }
`;

export const StyledSelectionContainer = styled.div`
  background: ${({ theme }) => theme.colors.layer};
  box-shadow: ${(props) =>
    props.theme.currentTheme === 'dark' ? 'none' : `0px 4px 40px ${props.theme.colors.cover4}`};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.cover4};
  width: ${({ width, matchWidth }) => (matchWidth ? `${width}px` : '300px')};
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndices.picker};
  height: ${({ height }) => typeof height === 'number' && `${height}px`};
  min-height: 20px;
  box-sizing: border-box;
`;

export const ScrollStyledSelectionContainer = styled(StyledSelectionContainer)`
  &::-webkit-scrollbar {
    width: 6px;
    background: ${(props) => props.theme.colors.base};
  }
  &::-webkit-scrollbar-thumb {
    width: 100%;
    height: auto;
    border-radius: 3px;
    background: ${(props) => props.theme.colors.text40};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text60};
  }
`;

export const StyledOptionItem = styled.div`
  height: ${({ size }) => getOptionHeightFromSize(size)}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text40 : theme.colors.text)};
  font-size: ${({ size }) => getFontSizeFromSize(size)}px;
  font-family: ${({ theme }) => theme.fonts.family};
  padding: 0 16px;
  padding-left: ${({ isGroup }) => (isGroup ? 18 : 12)}px;
  flex: 1;
  box-sizing: border-box;
  background: ${({ theme, selected }) => selected && theme.colors.cover2};
  &:hover {
    background: ${({ theme, disabled }) => !disabled && theme.colors.cover2};
  }
`;

export const StyledOptionGroupLabel = styled.div`
  line-height: 20px;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.family};
  color: ${({ theme }) => theme.colors.text60};
  padding: 0px 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const MultipleStyledSelectInputContainer = styled.div`
  display: flex;
  position: relative;
  flex: auto;
  flex-wrap: wrap;
  max-width: 100%;
  font-family: ${({ theme }) => theme.fonts.family};
`;

export const MultipleStyledSelectInputContainerItem = styled.div`
  flex: none;
  align-self: center;
  max-width: 100%;
  position: relative;
  font-family: ${({ theme }) => theme.fonts.family};
`;

export const TranBtnRoot = styled.div`
  position: relative;
  display: flex;
  flex: none;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  max-width: 100%;
  margin-top: 2px;
  margin-bottom: 2px;
  background-color: ${({ theme }) => theme.colors.cover8};
  border-radius: 4px;
  cursor: default;
  user-select: none;
  align-items: center;
  margin-inline-end: 4px;
  padding-inline-start: 8px;
  padding-inline-end: 8px;
`;

export const TranBtnContent = styled.div`
  display: inline-block;
  margin-right: 4px;
  overflow: hidden;
  white-space: pre;
  text-overflow: ellipsis;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        height: '24px',
        lineHeight: '24px',
      },
      medium: {
        height: '32px',
        lineHeight: '32px',
      },
      large: {
        height: '40px',
        lineHeight: '40px',
      },
    },
  })}
`;

export const SearchMirror = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  white-space: pre;
  visibility: hidden;
`;

export const StyledOptionItemContent = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, size, single, renderInput }) => {
  return {
    flex: 'auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: renderInput ? 500 : 400,
    ...(single &&
      renderInput && {
        lineHeight: `${getOptionHeightFromSize(size)}px`,
      }),
  };
});

export const StyledOptionItemIcon = styled.span`
  flex: none;
  margin-left: 4px;
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

export const LabelFieldSet = styled.fieldset`
  position: absolute;
  top: -6px;
  left: -2px;
  right: -2px;
  bottom: 0;
  pointer-events: none;
  border-radius: 8px;
  border-style: solid;
  ${({ noStyle, theme, error, isFocus }) => {
    const color = error
      ? theme.colors.secondary
      : isFocus
      ? theme.colors.textPrimary
      : theme.colors.cover12;
    return {
      borderWidth: '1px',
      borderColor: noStyle ? 'transparent' : color,
    };
  }}
  overflow: hidden;
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

export const EmptyContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 24px;
  padding-bottom: 24px;
`;
