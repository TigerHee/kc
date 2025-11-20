/**
 * Owner: willen@kupotech.com
 */
export default async function asyncSocket(cb) {
  const { kcWs, Topic } = await import('src/utils/socket');
  if (typeof cb === 'function') {
    cb(kcWs, { Topic });
  }
}
