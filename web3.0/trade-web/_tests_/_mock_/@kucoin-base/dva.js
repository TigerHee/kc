import * as routerRedux from 'connected-react-router';
import { create } from 'dva-core';
import createLoading from 'dva-loading';
import { createBrowserHistory } from 'history';

const { connectRouter, routerMiddleware } = routerRedux;

let dvaApp = {
  _store: {
    getState: () => ({
      app: {},
    }),
  },
};

function createDva(opts = {}) {
  const history = createBrowserHistory({ basename: '/trade', outsideRouterBase: '' });
  const createOpts = {
    initialReducer: {
      router: connectRouter(history),
    },
    setupMiddlewares(middlewares) {
      return [routerMiddleware(history), ...middlewares];
    },
    setupApp(app) {
      app._history = history;
    },
  };

  const app = create(opts, createOpts);
  app.use(createLoading());
  app.start();
  dvaApp = app;

  return app;
}

export function getDvaApp() {
  return dvaApp;
}

export default createDva;
