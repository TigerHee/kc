/**
 * Owner: victor.ren@kupotech.com
 */
const fnNameMatchRegex = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;
const getFunctionName = (fn) => {
  const match = `${fn}`.match(fnNameMatchRegex);
  const name = match && match[1];
  return name || '';
};

/**
 * @param {function} Component
 * @param {string} fallback
 * @returns {string | undefined}
 */
const getFunctionComponentName = (Component, fallback = '') =>
  Component.displayName || Component.name || getFunctionName(Component) || fallback;

const getWrappedName = (outerType, innerType, wrapperName) => {
  const functionName = getFunctionComponentName(innerType);
  return (
    outerType.displayName || (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName)
  );
};

/**
 * From react-is
 */
const ForwardRef = () => {
  const symbolFor = typeof Symbol === 'function' && Symbol.for;
  return symbolFor ? symbolFor('react.forward_ref') : 0xead0;
};

/**
 * @param {React.ReactType} Component
 * @returns {string | undefined}
 */
export default (Component) => {
  if (Component == null) {
    return undefined;
  }

  if (typeof Component === 'string') {
    return Component;
  }

  if (typeof Component === 'function') {
    return getFunctionComponentName(Component, 'Component');
  }

  if (typeof Component === 'object') {
    switch (Component.$$typeof) {
      case ForwardRef():
        return getWrappedName(Component, Component.render, 'ForwardRef');
      default:
        return undefined;
    }
  }

  return undefined;
};
