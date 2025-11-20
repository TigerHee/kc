/**
 * Owner: terry@kupotech.com
 */

export const ROOT_MASK_ID = 'kux-mask-root';

/**
 * 蒙层元素公共的根结点
 */
export function getMaskRoot() {
  let PORTAL_CONTAINER = document.getElementById(ROOT_MASK_ID);
  if (!PORTAL_CONTAINER) {
    const root = document.body;
    PORTAL_CONTAINER = document.createElement('div');
    PORTAL_CONTAINER.id = ROOT_MASK_ID;
    root.appendChild(PORTAL_CONTAINER);
  }
  return PORTAL_CONTAINER;
}
