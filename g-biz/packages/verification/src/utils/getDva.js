/*
 * @owner: vijay.zhou@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';

export default function getDva() {
  return new Promise((resolve) => {
    remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva) => {
      let store;
      let history;
      try {
        store = dva._store;
        history = dva._history;
      } catch (e) {
        store = {};
        history = dva._history;
      }
      resolve({ store, history });
    });
  });
}
