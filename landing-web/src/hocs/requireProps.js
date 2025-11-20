/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * runtime: browser
 */
import React from 'react';
import _ from 'lodash';
import AbsoluteLoading from 'components/AbsoluteLoading';

const requireProps = (propConditions, placeholder) =>
  (WrappedComponent) => {
    return (props) => {
      if (_.some(propConditions, (condition, propName) => {
        let pass = false;
        if (_.isFunction(condition)) {
          pass = !!condition.call(null, props[propName], props);
        }
        return !pass;
      })) {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            { placeholder || <AbsoluteLoading size="large" /> }
          </div>
        );
      }

      return React.createElement(WrappedComponent, props);
    };
  };

export default requireProps;
