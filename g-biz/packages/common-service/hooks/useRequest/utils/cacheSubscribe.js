/*
 * @owner: borden@kupotech.com
 */
const listeners = {};

const trigger = (key, data) => {
  if (listeners[key]) {
    listeners[key].forEach((listener) => listener(data));
  }
};

const subscribe = (key, listener) => {
  if (!listeners[key]) {
    listeners[key] = [];
  }

  listeners[key].push(listener);

  return function unsubscribe() {
    const index = listeners[key].indexOf(listener);

    listeners[key].splice(index, 1);
  };
};

export { trigger, subscribe };
