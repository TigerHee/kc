/**
 * Owner: solar@kupotech.com
 */
import clsx from 'clsx';
import React from 'react';
export function withNativeProps(props, element) {
  const p = {
    ...element.props,
  };
  if (props.className) {
    p.className = clsx(element.props.className, props.className);
  }
  if (props.style) {
    p.style = {
      ...p.style,
      ...props.style,
    };
  }
  if (props.tabIndex !== undefined) {
    p.tabIndex = props.tabIndex;
  }
  for (const key in props) {
    if (!props.hasOwnProperty(key)) continue;
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      p[key] = props[key];
    }
  }
  return React.cloneElement(element, p);
}
