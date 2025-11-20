/**
 * Owner: victor.ren@kupotech.com
 */
export function getTargetRect(target) {
  return target !== window
    ? target.getBoundingClientRect()
    : { top: 0, bottom: window.innerHeight };
}

export function getFixedTop(placeholderReact, targetRect, offsetTop) {
  if (offsetTop !== undefined && targetRect.top > placeholderReact.top - offsetTop) {
    return offsetTop + targetRect.top;
  }
  return undefined;
}

export function getFixedBottom(placeholderReact, targetRect, offsetBottom) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderReact.bottom + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;
    return offsetBottom + targetBottomOffset;
  }
  return undefined;
}