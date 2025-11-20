/**
 * Owner: victor.ren@kupotech.com
 */
import generateClass from './generateClassName';

export default function generateClassNames(componentName, slots) {
  const result = {};

  slots.forEach((slot) => {
    result[slot] = generateClass(componentName, slot);
  });

  return result;
}
