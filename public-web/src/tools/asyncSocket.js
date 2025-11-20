/**
 * Owner: willen@kupotech.com
 */
export default async function asyncSocket(cb) {
  const ws = await import('@kc/socket');
  if (typeof cb === 'function') {
    cb(ws.getInstance(), ws);
  }
}
