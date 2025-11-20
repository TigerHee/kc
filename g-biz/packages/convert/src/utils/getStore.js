/*
 * @owner: borden@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';

export default function getStore() {
  return new Promise((resolve) => {
    remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva) => {
      let store;
      try {
        store = dva._store.getState();
      } catch (e) {
        store = {};
      }
      resolve(store || {});
    });
  });
}
