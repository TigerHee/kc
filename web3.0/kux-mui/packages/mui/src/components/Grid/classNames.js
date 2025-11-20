/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName } from 'styles/index';

export function getRowClassName(slot) {
  return generateClassName('KuxRow', slot);
}

export function getColClassName(slot) {
  return generateClassName('KuxCol', slot);
}
