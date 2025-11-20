import { NAMESPACE } from "./config";

export const setUser = (...args) => {
  return window[NAMESPACE]?.configureScope((scope) => {
    scope?.setUser(...args);
  });
};

export const setTag = (...args) => {
  return window[NAMESPACE]?.configureScope((scope) => {
    scope?.setTag(...args);
  });
};

export const setTags = (...args) => {
  return window[NAMESPACE]?.configureScope((scope) => {
    scope?.setTags(...args);
  });
};

export const captureEvent = (...params) => {
  window[NAMESPACE]?.captureEvent(...params);
};
export const captureException = (...params) => {
  window[NAMESPACE]?.captureException(...params);
};
export const captureMessage = (...params) => {
  window[NAMESPACE]?.captureMessage(...params);
};
export const captureUserFeedback = (...params) => {
  window[NAMESPACE]?.captureUserFeedback(...params);
};
