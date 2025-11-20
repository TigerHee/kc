/**
 * Owner: willen@kupotech.com
 */
/**
 * reduceProps
 * runtime: next/browser
 */
import React from 'react';
import _ from 'lodash';

const reduceProps = (initValueMap) => (WrappedComponent) => {
  return (props) => {
    const reducedProps = {};
    _.each(initValueMap, (initValue, propName) => {
      const value = props[propName];

      if (initValue.$$isCreator) {
        initValue = initValue.call(null, props);
      }

      if (_.isFunction(value)) {
        reducedProps[propName] = value.call(null, initValue);
      } else if (typeof value === 'undefined') {
        reducedProps[propName] = initValue;
      }
    });

    return React.createElement(WrappedComponent, {
      ...props,
      ...reducedProps,
    });
  };
};

reduceProps.creator = (fn) => {
  if (!_.isFunction(fn)) {
    throw new TypeError('Expected parameter to be a function');
  }
  fn.$$isCreator = true;

  return fn;
};

export default reduceProps;
