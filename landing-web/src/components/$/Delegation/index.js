/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import _ from 'lodash';

const Delegation = props => {
  const { data_key, callback, children } = props;

  const handleClick = e => {
    if (_.isString(data_key)) {
      if (e.target.getAttribute('data-href') === data_key) {
        if (callback) {
          callback();
        }
      }
    }
    if (_.isUndefined(data_key)) {
      callback(e.target.getAttribute('data-href'));
    }
  };

  return <span onClick={handleClick}>{children}</span>;
};
export default Delegation;