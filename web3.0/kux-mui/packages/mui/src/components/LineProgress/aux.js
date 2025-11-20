/**
 * Owner: victor.ren@kupotech.com
 */
export function validProgress(progress) {
  if (!progress || progress < 0) {
    return 0;
  }
  if (progress > 100) {
    return 100;
  }
  return isNaN(Number(progress)) ? 0 : Number(progress);
}
