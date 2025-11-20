/**
 * Owner: willen@kupotech.com
 */
import KCSocket from '@/types/socket/KcSocket';

type Callback = (socket: KCSocket, ws: typeof import("@kc/socket")) => void;

/**
 * instance是单例的，不会重复创建
 * @param cb Callback function that receives the socket instance and the ws module.
 */
export default async function asyncSocket(cb: Callback) {
  const ws = await import('@kc/socket');
  if (typeof cb === 'function') {
    cb(ws.getInstance(), ws);
  }
}
