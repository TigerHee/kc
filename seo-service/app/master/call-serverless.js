/**
 * aws serverless 调用
 * Owner: hanx.wei@kupotech.com
 */
const { request } = require('urllib');
const { SERVERLESS_TRIGGER } = require('@scripts/config');
const logger = require('@app/master/logger');

async function requestServerless(data) {
  try {
    const result = await request(SERVERLESS_TRIGGER, {
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data,
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request serverless failed, code ${result.statusCode}`);
    }
    return result.data;
  } catch (err) {
    // console.log('Serverless Trigger Error', err);
    logger.error('Serverless Trigger Error', err);
  }
}

async function callServerlessGen(projectName, urls, pageType) {
  await requestServerless({
    pageType,
    projectName,
    urls,
    taskType: 'GEN',
  });
}

async function callServerlessCancel(projectName) {
  await requestServerless({
    projectName,
    taskType: 'CANCEL',
  });
}

async function callServerlessClear() {
  await requestServerless({
    taskType: 'CLEAR',
  });
}

module.exports = {
  callServerlessGen,
  callServerlessCancel,
  callServerlessClear,
};
