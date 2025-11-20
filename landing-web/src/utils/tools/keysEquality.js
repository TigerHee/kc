/**
 * Owner: melon@kupotech.com
 */
const keysEquality = (fields) => {
  return (a, b) => {
    for (let i = 0; i < fields.length; i++) {
      if (a[fields[i]] !== b[fields[i]]) {
        return false;
      }
    }
    return true;
  };
};

export default keysEquality;
