/**
 * Owner: borden@kupotech.com
 */
import React, { useContext, forwardRef } from 'react';
import { Global, css } from '@kux/mui/emotion';
import { forIn } from 'lodash';
import * as allContext from '@/components/ComponentWrapper/context';
import _styled from '@emotion/styled';

export { Global, css };
export const styled = _styled;

export const colors = (props, key) => props?.theme?.colors[key] || '';

const cursor = (v = 'pointer') => `cursor: ${v};`;
const lineHeight = (v = 14, unit = 'px') => `line-height: ${v}${unit};`;

// 样式函数自定义,主要是让他有语法提示，暂时v还没搞，要搞得用枚举了
export const fx = {
  display: (v) => `display: ${v};`,
  width: (v, unit = 'px') => `width: ${v}${unit};`,
  minWidth: (v, unit = 'px') => `min-width: ${v}${unit};`,
  maxWidth: (v, unit = 'px') => `max-width: ${v}${unit};`,
  height: (v, unit = 'px') => `height: ${v}${unit};`,
  minHeight: (v, unit = 'px') => `min-height: ${v}${unit};`,
  maxHeight: (v, unit = 'px') => `max-height: ${v}${unit};`,
  cursor,
  lineHeight,
  overflow: (v) => `overflow: ${v};`,

  // text
  textAlign: (v) => `text-align: ${v};`,

  // border
  border: (v = '1px solid') => `border: ${v};`,
  borderBottom: (v = '1px solid') => `border-bottom: ${v};`,
  borderRadius: (v) => `border-radius: ${v};`,
  borderColor: (v) => `border-color: ${v};`,
  borderWidth: (v = 1, unit = 'px') => `border-width: ${v}${unit};`,
  borderStyle: (v) => `border-style: ${v};`,
  // padding
  padding: (v) => `padding: ${v};`,
  paddingLeft: (v, unit = 'px') => `padding-left: ${v}${unit};`,
  paddingRight: (v, unit = 'px') => `padding-right: ${v}${unit};`,
  paddingBottom: (v, unit = 'px') => `padding-bottom: ${v}${unit};`,
  paddingTop: (v, unit = 'px') => `padding-top: ${v}${unit};`,
  // margin
  margin: (v) => `margin: ${v};`,
  marginLeft: (v, unit = 'px') => `margin-left: ${v}${unit};`,
  marginRight: (v, unit = 'px') => `margin-right: ${v}${unit};`,
  marginBottom: (v, unit = 'px') => `margin-bottom: ${v}${unit};`,
  marginTop: (v, unit = 'px') => `margin-top: ${v}${unit};`,
  // bg
  background: (v) => `background: ${v};`,
  backgroundColor: (props, key) => `background-color: ${colors(props, key)};`,
  backgroundImage: (v) => `background-image: ${v};`,
  backgroundRepeat: (v = 'no-repeat') => `background-repeat: ${v};`,
  backgroundPosition: (v) => `background-postion: ${v};`,
  backgroundSize: (v) => `background-size: ${v};`,
  // font
  font: (v) => `font: ${v};`,
  fontSize: (v = 14, unit = 'px') => `font-size: ${v}${unit};`,
  fontFamily: (v) => `font-family: ${v};`,
  fontFace: (v) => `font-face: ${v};`,
  fontWeight: (v = 400) => `font-weight: ${v};`,
  color: (props, key) => `color: ${colors(props, key)};`,
  textDecoration: (v) => `text-decoration: ${v}`,

  // flex
  alignItems: (v) => `align-items: ${v};`,
  justifyContent: (v) => `justify-content: ${v};`,
  flexWrap: (v) => `flex-wrap: ${v};`,
  flexFlow: (v) => `flex-flow: ${v};`,
  flexShrink: (v) => `flex-shrink: ${v};`,
  flex: (v) => `flex: ${v};`,
  alignContent: (v) => `align-content: ${v};`,

  // position
  position: (v) => `position: ${v};`,

  // transform
  transform: (v) => `transform: ${v};`,
  wordBreak: (v) => `word-break: ${v};`,
};

// style-components合并样式
export const styleCombine = (target, styles) => {
  if (!styles) {
    return target;
  }
  const ret = styles;
  //
  forIn(target, (value, key) => {
    if (!ret[key]) {
      ret[key] = value;
    }
  });
  return ret;
};

export const mediaLayout = (screen, point, code) => {
  if (screen === point) {
    return code;
  }
  return '';
};

// HOC，注入screen断点
export const withMedia = (name, FC) => {
  return forwardRef(({ children, ...others }, ref) => {
    const screen = useContext(allContext[name]);
    const _colors = (key) => {
      return colors(others, key);
    };
    const media = (breakPoint, code) => {
      return mediaLayout(screen, breakPoint, code);
    };
    return (
      <FC
        ref={ref}
        $colors={_colors}
        $media={media}
        $screen={screen}
        {...others}
      >
        {children}
      </FC>
    );
  });
};

export const withStyle = (FC) => {
  return forwardRef(({ children, ...others }, ref) => {
    const _colors = (key) => {
      return colors(others, key);
    };
    return (
      <FC ref={ref} $colors={_colors} {...others}>
        {children}
      </FC>
    );
  });
};
