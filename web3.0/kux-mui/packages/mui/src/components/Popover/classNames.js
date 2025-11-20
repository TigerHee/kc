/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName } from 'styles/index';

export default function getPopoverClassName(slot) {
  return generateClassName('KuxPopover', slot);
}
