/**
 * Owner: victor.ren@kupotech.com
 */
export default function ownerDocument(node) {
  return (node && node.ownerDocument) || document;
}
