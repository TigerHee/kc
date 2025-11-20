/**
 * Owner: willen@kupotech.com
 */
import Socket, {
  SOCKET_STATE,
  TOPIC_STATE as TopicStateConst,
  Topic as TopicConst,
} from '@kc/socket';
const kcSocket = new Socket({ type: 'spot' });
const kumexSocket = new Socket({ type: 'kumex' });
// connected适配
kcSocket.connected = () => kcSocket.getSocketState() === SOCKET_STATE.CONNECTED;
kumexSocket.connected = () => kumexSocket.getSocketState() === SOCKET_STATE.CONNECTED;

export const kcWs = kcSocket;
export const kumexWs = kumexSocket;
export const Topic = TopicConst;
export const TOPIC_STATE = TopicStateConst;
