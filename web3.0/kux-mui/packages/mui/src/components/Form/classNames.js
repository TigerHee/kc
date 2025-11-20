/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName } from 'styles/index';

export default function getFormClassName(slot) {
  return generateClassName('KuxForm', slot);
}
