/**
 * Owner: tiger@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import styled from '@emotion/native';
import API from './API';
import registerAPI from 'utils/registerAPI';
import { fade } from 'utils/colorManipulator';
import useTheme from 'hooks/useTheme';
import kcIcon from 'assets/common/Loading/kc.png';

const LoadingBox = styled.View`
  position: relative;
  align-self: flex-start;
`;
const LoadingMask = styled.View`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => fade(theme.colorV2.layer, 0.4)};
`;
const LoadingIconBox = styled.View`
  position: relative;
`;
const LoadingIcon = styled.View`
  border-style: solid;
  border-right-color: ${({ multipleColor }) => multipleColor};
  border-bottom-color: ${({ multipleColor }) => multipleColor};
  transform: ${({ rotate }) => `rotate(${rotate}deg)`};
  width: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.w}px`};
  height: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.w}px`};
  border-width: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.borderWidth}px`};
  border-radius: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.w}px`};
  ${({ multipleColor, fewColor, showKcIcon }) => {
    // 安卓兼容问题
    if (showKcIcon) {
      return `
      border-top-color: ${multipleColor};
      border-left-color: ${fewColor};
    `;
    }
    return `
      border-left-color: ${multipleColor};
      border-top-color: ${fewColor};
    `;
  }}
`;
const KcIconBox = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  width: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.w}px`};
  height: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.w}px`};
`;
const KcIcon = styled.Image`
  width: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.w / 2}px`};
  height: ${({ size, sizeConfig }) => `${sizeConfig?.[size]?.w / 2}px`};
`;
/**
 * @description:默认使用kcIcon
 * @param {*} iconSource themeProvider传递过来
 * @param {*} iconSourceFromProp loading组件， 优先级最高
 * @return {*}
 */
const getLoadingIcon = (iconSourceFromTxt, iconSourceFromProp, dftIconSource) => {
  if (iconSourceFromProp !== undefined) return iconSourceFromProp;
  if (iconSourceFromTxt !== undefined) return iconSourceFromTxt;
  return dftIconSource;
};

const Loading = ({
  spin,
  size,
  style,
  children,
  color,
  coverElementStyle,
  showKcIcon,
  styles,
  iconSource,
}) => {
  const theme = useTheme();
  const [rotate, setRotate] = useState(0);
  const rafId = useRef(null);

  // 各种size的尺寸配置
  const sizeConfig = useMemo(() => {
    return {
      large: {
        w: 40,
        borderWidth: 4,
      },
      medium: {
        w: 32,
        borderWidth: 3,
      },
      small: {
        w: showKcIcon ? 24 : 20,
        borderWidth: 2,
      },
      xsmall: {
        w: 12,
        borderWidth: 1,
      },
      xxsmall: {
        w: 8,
        borderWidth: 1,
      },
    };
  }, [showKcIcon]);

  const loopAnimation = useCallback(() => {
    setRotate((i) => (i >= 360 ? 1 : i + 7));
    rafId.current = requestAnimationFrame(loopAnimation);
  }, []);

  useEffect(() => {
    spin && loopAnimation();
    return () => {
      rafId.current && cancelAnimationFrame(rafId.current);
    };
  }, [spin]);

  // 旋转icon占比多的颜色
  const multipleColor = useMemo(() => {
    if (showKcIcon) {
      return color ? fade(color, 0.38) : theme.colorV2.cover12;
    }
    return color ? color : theme.colorV2.primary;
  }, [color, theme, showKcIcon]);
  // 旋转icon占比少的颜色
  const fewColor = useMemo(() => {
    if (showKcIcon) {
      return color ? color : theme.colorV2.primary;
    }
    return color ? fade(color, 0.38) : theme.colorV2.primary38;
  }, [color, theme, showKcIcon]);

  const iconSrc = getLoadingIcon(theme.options?.loadingIconSource, iconSource, kcIcon);

  const renderIcon = useCallback(() => {
    return (
      <LoadingIconBox style={[style, styles.loadingIconBox]}>
        <LoadingIcon
          color={color}
          rotate={rotate}
          size={size}
          multipleColor={multipleColor}
          fewColor={fewColor}
          style={styles.loadingIcon}
          showKcIcon={showKcIcon}
          sizeConfig={sizeConfig}
        />
        {showKcIcon && (
          <KcIconBox size={size} sizeConfig={sizeConfig} style={styles.KcIconBox}>
            <KcIcon source={iconSrc} size={size} sizeConfig={sizeConfig} style={styles.KcIcon} />
          </KcIconBox>
        )}
      </LoadingIconBox>
    );
  }, [rotate, style, size, showKcIcon, styles, multipleColor, fewColor]);

  return children ? (
    spin ? (
      <LoadingBox style={styles.loadingBox}>
        <LoadingMask style={[coverElementStyle, styles.loadingMask]}>{renderIcon()}</LoadingMask>
        {children}
      </LoadingBox>
    ) : (
      children
    )
  ) : (
    renderIcon()
  );
};

registerAPI(Loading, API);
export default Loading;
