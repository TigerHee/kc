/**
 * Owner: garuda@kupotech.com
 */
function executeCallback(promise: Promise<any>, callback: any) {
  if (callback) {
    promise.then(
      (result) => {
        callback(null, result);
      },
      (error) => {
        callback(error);
      },
    );
  }
}
export default executeCallback;
