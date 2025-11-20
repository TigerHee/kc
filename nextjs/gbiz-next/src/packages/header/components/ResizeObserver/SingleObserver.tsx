/**
 * Owner: victor.ren@kupotech.com
 */
/* eslint-disable react/no-find-dom-node */

// @ts-nocheck
import ReactDOM from 'react-dom';
import React from 'react';
import { composeRef, supportRef } from './utils';
import { observe, unobserve } from './aux';
import DomWrapper from './DomWrapper';
import { CollectionContext } from './Collection';

function findDOMNode(node) {
  if (node instanceof HTMLElement) {
    return node;
  }
  return ReactDOM.findDOMNode(node);
}

export default function SingleObserver(props) {
  const { children, disabled } = props;
  const elementRef = React.useRef(); 
  const wrapperRef = React.useRef();

  const onCollectionResize = React.useContext(CollectionContext);

  // =========================== Children ===========================
  const isRenderProps = typeof children === 'function';
  const mergedChildren = isRenderProps ? children(elementRef) : children;

  // ============================= Size =============================
  const sizeRef = React.useRef({
    width: -1,
    height: -1,
    offsetWidth: -1,
    offsetHeight: -1,
  });

  // ============================= Ref ==============================
  const canRef =
    !isRenderProps && React.isValidElement(mergedChildren) && supportRef(mergedChildren);
  const originRef = canRef ? mergedChildren.ref : null;

  const mergedRef = React.useMemo(() => composeRef(originRef, elementRef), [originRef, elementRef]);

  // =========================== Observe ============================
  const propsRef = React.useRef(props);
  propsRef.current = props;

  // Handler
  const onInternalResize = React.useCallback((target) => {
    const { onResize, data } = propsRef.current;

    const { width, height } = target.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = target;

    /**
     * Resize observer trigger when content size changed.
     * In most case we just care about element size,
     * let's use `boundary` instead of `contentRect` here to avoid shaking.
     */
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);

    if (
      sizeRef.current.width !== fixedWidth ||
      sizeRef.current.height !== fixedHeight ||
      sizeRef.current.offsetWidth !== offsetWidth ||
      sizeRef.current.offsetHeight !== offsetHeight
    ) {
      const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight };
      sizeRef.current = size;

      // IE is strange, right?
      const mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
      const mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;

      const sizeInfo = {
        ...size,
        offsetWidth: mergedOffsetWidth,
        offsetHeight: mergedOffsetHeight,
      };

      onCollectionResize?.(sizeInfo, target, data);

      if (onResize) {
        Promise.resolve().then(() => {
          onResize(sizeInfo, target);
        });
      }
    }
  }, []);

  // Dynamic observe
  React.useEffect(() => {
    const currentElement = findDOMNode(elementRef.current) || findDOMNode(wrapperRef.current);

    if (currentElement && !disabled) {
      observe(currentElement, onInternalResize);
    }

    return () => unobserve(currentElement, onInternalResize);
  }, [disabled, elementRef, wrapperRef, onInternalResize]);

  // ============================ Render ============================
  return (
    <DomWrapper ref={wrapperRef}>
      {canRef
        ? React.cloneElement(mergedChildren, {
            ref: mergedRef,
          })
        : mergedChildren}
    </DomWrapper>
  );
}
