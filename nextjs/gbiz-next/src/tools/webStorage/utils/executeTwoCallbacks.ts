/**
 * Owner: garuda@kupotech.com
 */
function executeTwoCallbacks(promise: Promise<any>, callback?: any, errorCallback?: any) {
  if (typeof callback === 'function') {
    promise.then(callback);
  }
  if (typeof errorCallback === 'function') {
    promise.catch(errorCallback);
  }
}
export default executeTwoCallbacks;
