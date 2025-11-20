import { IPopoverProps } from '.';

export const isScrollable = (node: Element, horizontal?: boolean) => {
  if (horizontal) {
    return node.scrollWidth > node.clientWidth;
  }
  return node.scrollHeight > node.clientHeight;
};

export const getScrollParent = (node: Element | null) => {
  if (!node) {
    return null;
  }
  let currentParent = node.parentElement;
  while (currentParent) {
    if (isScrollable(currentParent)) {
      return currentParent;
    }
    currentParent = currentParent.parentElement;
  }
  return document.scrollingElement || document.documentElement;
};

export const handleChangePlacementByDir = (placement: IPopoverProps['placement'], dir: 'ltr' | 'rtl') => {
  if (dir === 'rtl') {
    if (placement.includes('left')) {
      return placement.replace('left', 'right');
    }
    if (placement.includes('right')) {
      return placement.replace('right', 'left');
    }
    if (placement.includes('start') || placement.includes('end')) {
      if (placement.includes('start')) {
        return placement.replace('start', 'end');
      }
      if (placement.includes('end')) {
        return placement.replace('end', 'start');
      }
    }
  }
  return placement;
};