/**
 * Owner: solar@kupotech.com
 */

import { create } from 'dva-core';
import createLoading from 'dva-loading';

let app;
let store;
let dispatch;

function createDvaApp(models) {
  app = create();
  app.use(createLoading());
  models.forEach(model => app.model(model));
  app.start();
  store = app._store;
  dispatch = store.dispatch;
  return app;
}

export function getStore() {
  return store;
}

export function getDispatch() {
  return dispatch;
}

export default createDvaApp;
