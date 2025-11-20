/*
 * @owner: borden@kupotech.com
 */
const listeners: any = {};

const trigger = (key: any, data: any): void => {
  if (listeners[key]) {
    listeners[key].forEach((listener: any) => listener(data));
  }
};

const subscribe = (key: any, listener: any): any => {
  if (!listeners[key]) {
    listeners[key] = [];
  }

  listeners[key].push(listener);

  return function unsubscribe(): void {
    const index = listeners[key].indexOf(listener);
    listeners[key].splice(index, 1);
  };
};

export { trigger, subscribe };
