/**
 * Owner: victor.ren@kupotech.com
 */
export default function createChainedFunction(funcs, extraArg) {
  return funcs.reduce(
    (acc, func) => {
      if (func == null) return acc;
      return function chainedFunction(...args) {
        const argums = [...args];
        if (extraArg && argums.indexOf(extraArg) === -1) {
          argums.push(extraArg);
        }
        acc.apply(this, argums);
        func.apply(this, argums);
      };
    },
    () => {},
  );
}
