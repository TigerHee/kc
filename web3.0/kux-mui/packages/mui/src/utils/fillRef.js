/**
 * Owner: victor.ren@kupotech.com
 */
export default function fillRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    ref.current = node;
  }
}
