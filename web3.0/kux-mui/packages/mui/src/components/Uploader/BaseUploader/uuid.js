/**
 * Owner: victor.ren@kupotech.com
 */
const now = +new Date();
let index = 0;

export default function uid() {
  return `kux-upload-${now}-${++index}`;
}
