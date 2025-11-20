/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName } from 'styles/index';

export default function getStepsClassName(slot) {
  return generateClassName('KuxSteps', slot);
}

export function getStepClassName(slot) {
  return generateClassName('KuxStep', slot);
}
