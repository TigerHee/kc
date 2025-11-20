/**
 * Owner: hanx.wei@kupotech.com
 */
require('module-alias/register');
const config = require('@scripts/config');
const Master = require('./master');

new Master({ config }).start();
