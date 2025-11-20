/**
 * Owner: victor.ren@kupotech.com
 */
export default function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
