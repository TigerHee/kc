/**
 * Owner: victor.ren@kupotech.com
 */
function fillRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    ref.current = node;
  }
}

export default function composeRef(...refs) {
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
