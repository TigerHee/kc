/**
 * Owner: willen@kupotech.com
 */
/**
 * trigger 404
 */
const throw404 = () => {
  const ee = new Error('trigger 404');
  ee.code = 'ENOENT'; // Triggers a 404
  ee._no_sentry = true;
  throw ee;
};

export default throw404;
