/**
 * Owner: willen@kupotech.com
 */
import EventEmitter from 'event-emitter';

/**
 * 事件集合，可以创建、获取、删除指定的事件(只需要一个事件处理器, 建议不传参数，这样可以保持单例模式)
 */
const evts = {};

const getEvt = (evtId = 'event'): EventEmitter => {
  if (!evts[evtId]) {
    evts[evtId] = new EventEmitter();
  }
  return evts[evtId];
};

const removeEvt = (id: string) => {
  delete evts[id];
};


const evtEmitter = {
  getEvt,
  removeEvt,
};

export default evtEmitter;
