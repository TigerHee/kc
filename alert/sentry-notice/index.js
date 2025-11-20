/**
 * Owner: derrick@kupotech.com
 */
require('es6-promise').polyfill();

const path = require('path');

/**
 * get env config
 */
require('dotenv').config();

const app = require('./app');
/**
 * just run.
 */
app.run();
