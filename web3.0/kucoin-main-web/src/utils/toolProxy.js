/**
 * Owner: willen@kupotech.com
 */
export default (target, init) => {
  let inited = false;

  const proxy = new Proxy(target, {
    get: function (target, property, receiver) {
      if (!inited) {
        init.call(target);
        inited = true;
      }
      const method = Reflect.get(target, property, receiver);
      return method;
    },
  });

  return proxy;
};
