import { isEmpty } from 'lodash-es';

const omit = (filter) => {
  let temp = {};
  if (isEmpty(filter)) {
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
