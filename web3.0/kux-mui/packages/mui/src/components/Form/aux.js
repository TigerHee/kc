/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

const formItemNameBlackList = ['parentNode'];
const defaultItemNamePrefixCls = 'form_item';

export function getFieldId(namePath, formName) {
  if (!namePath.length) return undefined;

  const mergedId = namePath.join('_');

  if (formName) {
    return `${formName}_${mergedId}`;
  }

  const isIllegalName = formItemNameBlackList.indexOf(mergedId) >= 0;

  return isIllegalName ? `${defaultItemNamePrefixCls}_${mergedId}` : mergedId;
}

export function toArray(candidate = false) {
  if (candidate === undefined || candidate === false) return [];

  return Array.isArray(candidate) ? candidate : [candidate];
}

export const KuFoxFormContext = React.createContext();

export const KuFoxFormNoStyleItemContext = React.createContext();
