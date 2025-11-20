/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

export default function useClassNames(state) {

  const slots = {
    wrapper: ['wrapper'],
    outer: ['outer'],
    inner: ['inner'],
    info: ['info'],
    infoText: ['text'],
    infoStatus: ['status'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxLineProgress', slot));
}
