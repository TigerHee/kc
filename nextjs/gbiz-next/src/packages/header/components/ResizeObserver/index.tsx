/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { toArray } from './utils';
import SingleObserver from './SingleObserver';
import { Collection } from './Collection';

const INTERNAL_PREFIX_KEY = 'kufox-observer-key';

function ResizeObserver(props) {
  const { children } = props;
  // @ts-ignore
  const childNodes = typeof children === 'function' ? [children] : toArray(children);

  return childNodes.map((child, index) => {
    const key = child?.key || `${INTERNAL_PREFIX_KEY}-${index}`;
    return (
      <SingleObserver {...props} key={key}>
        {child}
      </SingleObserver>
    );
  });
}

ResizeObserver.Collection = Collection;

export default ResizeObserver;
