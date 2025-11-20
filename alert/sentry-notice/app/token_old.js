const exec = require("./utils");
const { log, error, configure } = require("./logger");

const kufoxToken = process.env.KUFOX_TOKEN;

let token = '';
let expires = 0;

function getAuthToken() {

  if (!kufoxToken) {
    console.log('kufox token is empty');
    return Promise.resolve('');
  }

  const now = Date.now();
  if (token && expires > now + 10 * 60 * 1000) {
    return Promise.resolve(token)
  }

  return exec(
    `curl -k -X 'POST' https://kufox-bot.kcprd.com/api/notify/tokens -H 'Content-Type:application/json' -d '${JSON.stringify({
      appId: '01GWS9HY0GJP3BYJFXG273FP3K',
      secret: kufoxToken
    })}'`
  ).then(res => {
    console.log('请求 token 结果', res);
    log(res);
    const json = JSON.parse(res);
    token = json.token;
    expires = Date.now() + json.expires * 1000;
    return json.token;
  }).catch(e => {
    log(e);
    console.log('请求 token 失败', e);
    return ''
  })

}

module.exports = getAuthToken;
