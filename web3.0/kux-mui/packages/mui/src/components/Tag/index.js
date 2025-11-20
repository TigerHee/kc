/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import propTypes from 'prop-types';
import { variant } from 'styled-system';

const TagRoot = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: ${(props) => props.theme.fonts.family};
  line-height: 130%;
  ${(props) => {
    return variant({
      prop: 'color',
      variants: {
        primary: () => {
          if (props.variant === 'contained') {
            return {
              background: props.theme.colors.primary8,
              color: props.theme.colors.primary,
            };
          }
          if (props.variant === 'outlined') {
            return {
              background: props.theme.colors.backgroundMajor,
              color: props.theme.colors.textPrimary,
              border: `1px solid ${props.theme.colors.textPrimary}`,
            };
          }
          return {
            background: props.theme.colors.primary8,
            color: props.theme.colors.primary,
          };
        },
        default: {
          background: props.theme.colors.cover4,
          color: props.theme.colors.text60,
        },
        secondary: () => {
          if (props.variant === 'contained') {
            return {
              background: props.theme.colors.secondary8,
              color: props.theme.colors.secondary,
            };
          }
          if (props.variant === 'outlined') {
            return {
              background: props.theme.colors.backgroundMajor,
              color: props.theme.colors.secondary,
              border: `1px solid ${props.theme.colors.secondary}`,
            };
          }
          return {
            background: props.theme.colors.secondary8,
            color: props.theme.colors.secondary,
          };
        },
        complementary: () => {
          if (props.variant === 'contained') {
            return {
              background: props.theme.colors.complementary8,
              color: props.theme.colors.complementary,
            };
          }
          if (props.variant === 'outlined') {
            return {
              background: props.theme.colors.backgroundMajor,
              color: props.theme.colors.complementary,
              border: `1px solid ${props.theme.colors.complementary}`,
            };
          }
          return {
            background: props.theme.colors.complementary8,
            color: props.theme.colors.complementary,
          };
        },
      },
    });
  }}
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: 12,
      },
      medium: {
        fontSize: 12,
      },
      large: {
        fontSize: 14,
      },
    },
  })}
`;

const Tag = React.forwardRef(({ children, size, color, variant, ...others }, ref) => {
  const theme = useTheme();
  return (
    <TagRoot color={color} variant={variant} size={size} theme={theme} ref={ref} {...others}>
      {children}
    </TagRoot>
  );
});

Tag.displayName = 'Tag';

Tag.propTypes = {
  color: propTypes.oneOf(['primary', 'default', 'secondary']),
  variant: propTypes.oneOf(['default', 'contained', 'outlined']),
  size: propTypes.oneOf(['small', 'medium', 'large']),
  children: propTypes.node,
};

Tag.defaultProps = {
  color: 'primary',
  variant: 'default',
  size: 'medium',
};

export default Tag;
