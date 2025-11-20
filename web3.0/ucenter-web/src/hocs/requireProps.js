/**
 * Owner: willen@kupotech.com
 */
/**
 * runtime: browser
 */
import AbsoluteLoading from 'components/AbsoluteLoading';
import _ from 'lodash';
import React from 'react';

const requireProps = (propConditions, placeholder) => (WrappedComponent) => {
  return (props) => {
    if (
      _.some(propConditions, (condition, propName) => {
        let pass = false;
        if (_.isFunction(condition)) {
          pass = !!condition.call(null, props[propName], props);
        }
        return !pass;
      })
    ) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {placeholder || <AbsoluteLoading />}
        </div>
      );
    }

    return React.createElement(WrappedComponent, props);
  };
};

export default requireProps;
