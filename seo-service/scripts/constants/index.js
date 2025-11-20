/**
 * Owner: hanx.wei@kupotech.com
 */
const NGINX_CACHE_SECONDS_BUFFER = 120;

const SERVERLESS_TRIGGER_DEV = 'https://it9t5i2m20.execute-api.ap-northeast-1.amazonaws.com/Prod/trigger';
const SERVERLESS_TRIGGER_PRE = 'https://uknny0wv32.execute-api.ap-northeast-1.amazonaws.com/Prod/trigger';
const SERVERLESS_TRIGGER_PRO = 'https://azg2wyr9hg.execute-api.ap-northeast-1.amazonaws.com/Prod/trigger';
// const SERVERLESS_TRIGGER_DEV = SERVERLESS_TRIGGER_PRE; // for test

module.exports = {
  NGINX_CACHE_SECONDS_BUFFER,
  SERVERLESS_TRIGGER_DEV,
  SERVERLESS_TRIGGER_PRE,
  SERVERLESS_TRIGGER_PRO,
};
