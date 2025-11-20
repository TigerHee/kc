/**
 * Owner: yang.yang@kupotech.com
 */

exports.decreaseWhenDev = function(isTest, arr) {
  if (!arr) return arr;
  if (isTest) {
    return arr.slice(0, 60);
    // return arr.slice(0, 6);
  }
  return arr;
};
