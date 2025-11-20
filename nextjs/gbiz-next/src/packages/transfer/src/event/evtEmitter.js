/**
 * Owner: solar@kupotech.com
 */
import EventEmitter from 'event-emitter';

/**
 * 事件集合，可以创建、获取、删除指定的事件(只需要一个事件处理器, 建议不传参数，这样可以保持单例模式)
 */
const evts = {};

const getEvt = (evtId = 'event') => {
  if (!evts[evtId]) {
    evts[evtId] = new EventEmitter();
  }
  return evts[evtId];
};

const removeEvt = (id) => {
  delete evts[id];
};

/**
 *
 * @type {{getEvt: (function(*): *), removeEvt: removeEvt}}
 */
export default {
  getEvt,
  removeEvt,
};
