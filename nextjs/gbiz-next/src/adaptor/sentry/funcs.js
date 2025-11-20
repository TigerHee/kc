import { NAMESPACE } from './config';

export const setUser = (...args) => {
  return window[NAMESPACE].configureScope((scope) => {
    scope.setUser(...args);
  });
};

export const setTag = (...args) => {
  return window[NAMESPACE].configureScope((scope) => {
    scope.setTag(...args);
  });
};

export const setTags = (...args) => {
  return window[NAMESPACE].configureScope((scope) => {
    scope.setTags(...args);
  });
};

export const configureScope = (fn = () => {}) => {
  return window[NAMESPACE].configureScope((scope) => {
    fn(scope);
  });
};

export const withScope = (fn = () => {}) => {
  return window[NAMESPACE].withScope((scope) => {
    fn(scope);
  });
};

export const captureException = (...args) => {
  return window[NAMESPACE].captureException(...args);
};

export const captureMessage = (...args) => {
  return window[NAMESPACE].captureMessage(...args);
};

export const captureEvent = (...args) => {
  return window[NAMESPACE].captureEvent(...args);
};

export const addBreadcrumb = (...args) => {
  return window[NAMESPACE].addBreadcrumb(...args);
};
