// @ts-nocheck
import React, { ReactNode } from 'react';
import { isMemo } from 'react-is';

function fillRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    ref.current = node;
  }
}

export function composeRef(...refs) {
  const refList = refs.filter((ref) => ref);
  if (refList.length <= 1) {
    return refList[0];
  }
  return (node) => {
    refs.forEach((ref) => {
      fillRef(ref, node);
    });
  };
}

export function supportRef(nodeOrComponent) {
  const type = isMemo(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;

  if (typeof type === 'function' && !type.prototype?.render) {
    return false;
  }

  if (typeof nodeOrComponent === 'function' && !nodeOrComponent.prototype?.render) {
    return false;
  }

  return true;
}


import { isFragment } from 'react-is';

export function toArray(children, option) {
  let ret = [];

  React.Children.forEach(children, (child) => {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return;
    }
    if (Array.isArray(child)) {
      // @ts-ignore
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      // @ts-ignore
      ret.push(child);
    }
  });
  return ret;
}
