/**
 * Owner: borden@kupotech.com
 */

const context = require.context('.', true, /.*\.theme\.less$/);

context.keys().forEach((r) => {
  context(r);
});
