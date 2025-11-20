/**
 * Owner: victor.ren@kupotech.com
 */
import deepmerge from './deepmerge';
import ownerDocument from './ownerDocument';
import setRef from './setRef';
import debounce from './debounce';
import ownerWindow from './ownerWindow';
import elementAcceptingRef from './elementAcceptingRef';
import createChainedFunction from './createChainedFunction';
import composeRef from './composeRef';
import omit from './omit';
import showEqual from './showEqual';
import warning from './warning';
import canUseDom from './canUseDom';
import isStyleSupport from './styleChecker';
import toArray from './toArray';
import animate from './animate';
import refType from './refType';
import supportRef from './supportRef';
import raf from './raf';
import isVisible from './isVisible';
import fillRef from './fillRef';
import getTargetElement from './domTarget';
import capitalize from './capitalize';
import resolveOnChange from './resolveOnChange';
import getValue from './getValue';
import numberFormat from './numberFormat';
import dateTimeFormat from './dateTimeFormat';
import dateUtils from './dateUtils';

// 兼容引入方式
export * from './colorManipulator';
export * as colorManipulator from './colorManipulator';

export * from './scrollLeft';
export * as scrollLeft from './scrollLeft';

export * from './dom';
export * as dom from './dom';

export * from './px2rem';

export * from './event';

export {
  deepmerge,
  ownerDocument,
  setRef,
  debounce,
  ownerWindow,
  elementAcceptingRef,
  createChainedFunction,
  composeRef,
  omit,
  showEqual,
  warning,
  canUseDom,
  isStyleSupport,
  toArray,
  animate,
  refType,
  supportRef,
  raf,
  isVisible,
  fillRef,
  getTargetElement,
  capitalize,
  resolveOnChange,
  getValue,
  numberFormat,
  dateTimeFormat,
  dateUtils,
};
