/**
 * Owner: victor.ren@kupotech.com
 */
import classNameGenerator from './classNameGenerator';

export default function generateClassName(componentName, slot) {
  return `${classNameGenerator.generate(componentName)}-${slot}`;
}
