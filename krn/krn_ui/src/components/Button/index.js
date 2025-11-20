/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo } from 'react';
import styled from '@emotion/native';
import API from './API';
import registerAPI from 'utils/registerAPI';
import { TouchableHighlight } from 'react-native';
import Loading from 'components/Loading';
import { checkColor } from 'utils/helper';
import useTheme from 'hooks/useTheme';
import { fade } from 'utils/colorManipulator';

const getColorKey = (type, useFor) => {
  const config = {
    primary: {
      text: 'primaryButtonText',
      bg: 'primaryButtonBackground',
    },
    secondary: {
      text: 'secondaryButtonText',
      bg: 'secondaryButtonBackground',
    },
  };
  return config?.[type]?.[useFor];
};

const ButtonOuter = styled.TouchableHighlight`
  background: ${({ theme, color, type }) => {
    color = color || theme.colorV2[getColorKey(type, 'bg')];
    return color;
  }};
  opacity: ${({ disabled }) => {
    return disabled ? '0.4' : '1';
  }};
  ${({ size }) => {
    switch (size) {
      case 'mini':
        return `
          border-radius: 14px;
          height: 28px;
        `;
      case 'small':
        return `
          border-radius: 16px;
          height: 32px;
        `;
      case 'large':
        return `
          border-radius: 24px;
          height: 48px;
        `;
      default:
        // medium
        return `
          border-radius: 20px;
          height: 40px;
        `;
    }
  }}
`;
const ButtonBox = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  height: 100%;
  ${({ size, hasIcon }) => {
    switch (size) {
      case 'mini':
        return hasIcon ? `padding: 0 16px 0 12px;` : `padding: 0 16px;`;
      case 'small':
        return hasIcon ? `padding: 0 20px 0 16px;` : `padding: 0 20px;`;
      case 'large':
        return hasIcon ? `padding: 0 32px 0 24px;` : `padding: 0 32px;`;
      default:
        // medium
        return hasIcon ? `padding: 0 24px 0 20px;` : `padding: 0 24px;`;
    }
  }}
`;
const ButtonContent = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const ButtonText = styled.Text`
  color: ${({ theme, textColor }) => {
    const color = theme.colorV2[textColor];
    return color;
  }};
  text-align: center;
  font-weight: 600;
  ${({ size }) => {
    switch (size) {
      case 'mini':
        return `
          font-size: 12px;
        `;
      case 'small':
        return `
          font-size: 14px;
        `;
      case 'large':
        return `
          font-size: 16px;
        `;
      default:
        return `
          font-size: 14px;
        `;
    }
  }}
`;

const Button = ({
  children,
  style,
  textStyle,
  disabled,
  onPress,
  loading,
  size,
  color,
  icon = null, // 文字前 icon
  afterIcon = null, // 文字后 icon
  type, // primary | secondary
  styles,
}) => {
  const theme = useTheme();

  const textColor = useMemo(() => {
    const defaultTextColor = getColorKey(type, 'text');
    return color ? (checkColor(color) ? 'tip' : defaultTextColor) : defaultTextColor;
  }, [color, type]);

  return (
    <ButtonOuter
      style={[style, styles.buttonOuter]}
      color={color}
      size={size || ''}
      disabled={disabled}
      type={type}
      underlayColor={fade(theme.colorV2[getColorKey(type, 'bg')], type === 'primary' ? 0.8 : 0.08)}
      activeOpacity={1}
      onPress={() => {
        if (disabled || !onPress) {
          return;
        }
        onPress();
      }}
    >
      <ButtonBox size={size} hasIcon={!!icon} style={styles.buttonBox}>
        {loading.spin ? (
          <Loading showKcIcon={false} {...loading} />
        ) : (
          <ButtonContent style={styles.buttonContent}>
            {icon}

            <ButtonText
              style={[textStyle, styles.buttonText]}
              size={size || ''}
              textColor={textColor}
              disabled={disabled}
            >
              {children}
            </ButtonText>

            {afterIcon}
          </ButtonContent>
        )}
      </ButtonBox>
    </ButtonOuter>
  );
};

registerAPI(Button, API);

export default Button;
