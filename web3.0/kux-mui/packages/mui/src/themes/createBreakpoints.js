/**
 * Owner: victor.ren@kupotech.com
 */
const unit = 'px';

export default function createBreakpoints(breakPoints = {}) {
  const breakpoints = Object.values(breakPoints);
  const values = breakPoints;
  const keys = Object.keys(breakPoints);

  for (let i = 0; i < keys.length; i++) {
    breakpoints[keys[i]] = breakpoints[i];
  }

  function up(key) {
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (min-width:${value}${unit})`;
  }

  function down(key) {
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (max-width:${value - 1}${unit})`;
  }

  breakpoints.keys = keys;
  breakpoints.values = values;
  breakpoints.up = up;
  breakpoints.down = down;
  breakpoints.unit = unit;

  return breakpoints;
}
