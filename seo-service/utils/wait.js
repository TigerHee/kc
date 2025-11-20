/**
 * sleep for seconds
 * Owner: hanx.wei@kupotech.com
 */

module.exports = async time => new Promise(resolve => setTimeout(resolve, time * 1000));
