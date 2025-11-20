/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';

const omit = (filter) => {
  let temp = {};
  if (_.isEmpty(filter)) {
    temp = {};
  } else {
    Object.keys(filter).forEach((key) => {
      if (filter[key] === 'all') {
        temp[key] = '';
      } else {
        temp[key] = filter[key];
      }
    });
  }
  return temp;
};

export default omit;
