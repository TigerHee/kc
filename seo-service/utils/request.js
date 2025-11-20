/**
 * Owner: hanx.wei@kupotech.com
 */
require('isomorphic-fetch');

module.exports = function request(...args) {
  return fetch(...args)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = {
        msg: response.statusText,
        response,
      };
      throw error;
    })
    .then(res => res.json())
    .then(json => {
      if (typeof json.success === 'undefined' || json.success === false) {
        throw json;
      }
      return json;
    });
};
