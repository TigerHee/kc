/**
 * Owner: victor.ren@kupotech.com
 */

const formItemNameBlackList = ['parentNode'];
const defaultItemNamePrefixCls = 'form_item';

export function getFieldId(namePath: string[], formName?: string): string | undefined {
  if (!namePath.length) return undefined;

  const mergedId = namePath.join('_');

  if (formName) {
    return `${formName}_${mergedId}`;
  }

  const isIllegalName = formItemNameBlackList.indexOf(mergedId) >= 0;

  return isIllegalName ? `${defaultItemNamePrefixCls}_${mergedId}` : mergedId;
} 