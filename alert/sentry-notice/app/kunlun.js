const { log } = require("./logger");
const exec = require("./utils");
const escapeHtml = require("./escapeHtml");

const LEVEL_NAMES = ["NOTICE", "INFO", "CRITICAL"];
const DEFAULT_LEVEL = "NOTICE";
async function kunlunNotice(noticeLevel, alertGroup, aggTime, data) {
  const {
    project_name = "",
    level = "",
    url = "",
    message,
    event = {},
    triggering_rules = []
  } = data || {};
  let _message = message;
  let _title = message;
  if (!_message) {
    if (event && event.metadata) {
      _message = JSON.stringify({
        filename: event.metadata.filename,
        error: event.metadata.value,
      });
    }
  }
  let _request = JSON.stringify({
    url: event.request?.url || event.location
  });
  let _user = JSON.stringify(event.user);

  const api = "https://kunlun-api.kcprd.com/api/external/alarm/alert";
  const isP0 = triggering_rules.some((rule) => rule.startsWith('@level:p0'));
  const isInLevel = LEVEL_NAMES.includes(noticeLevel);
  const _level = isP0? "CRITICAL":DEFAULT_LEVEL;
  const NoticeLevel = noticeLevel && isInLevel? DEFAULT_LEVEL : _level; //NOTICE：只发teams INFO：发teams+短信 CRITICAL：发teams+短信+电话

  const text = `
  sentry 用例告警\n
  请求详情: ${_request}\n
  用户信息: ${_user}\n
  `;
  const _json = {
    tenant: "kc-pro",
    app: project_name,
    title: escapeHtml(_message),
    level: NoticeLevel,
    message: escapeHtml(text),
    indicator: "web_err_log",
    alarm_group: alertGroup,
    href_data: [
      {name: '查看详情', url : url},
      {name: 'insight跟进', url : `https://insight.kcprd.com/alert/detail?url=${url?.split('?')[0]}&alarmGroup=${alertGroup}`}
    ],
    agg_time: aggTime || '-1'
  };
  const command = `curl  -k -X 'POST' "${api}" -d '${JSON.stringify(
    _json
  )}' --header 'AUTH_API_KEY: ${
    process.env.KUNLUN_API_TOKEN
  }' --header 'Content-Type: application/json;charset=UTF-8'`;
  console.log("---请求如下----", command);
  exec(command)
    .then((response) => {
      console.log("请求 teamNotice 结果", response);
      log(response);
      return [response];
    })
    .catch((error) => {
      let errorText = "";
      try {
        errorText = JSON.stringify(error);
      } catch (stringifyError) {
        errorText = `Error stringifying error object: ${stringifyError.message}`;
      }
      const maskedError = errorText.replace(/AUTH_API_KEY: [\w-]+/g, 'KUNLUN: [MASKED]');
      log(maskedError);
      return [, error];
    });
}

async function domainErrorKunlunNotice(text, useTel) {
  const api = "https://kunlun-api.kcprd.com/api/external/alarm/alert";
  
  const _json = {
    tenant: "kc-pro",
    app: 'domain-error',
    title: '域名连通性告警',
    level: 'NOTICE',
    message: escapeHtml(text),
    indicator: "web_err_log",
    alarm_group: 'frontend-domain-error',
    href_data: [{name: '查看详情', url : `https://sentry-v2.staticimg.co/organizations/web/alerts/rules/?project=15&statsPeriod=24h`}],
    agg_time: '-1',
    user_name: "",
    notice_type: useTel ? ['PHONE', 'TEAMS'] : ['TEAMS'],
  };
  const command = `curl  -k -X 'POST' "${api}" -d '${JSON.stringify(
    _json
  )}' --header 'AUTH_API_KEY: ${
    process.env.KUNLUN_API_TOKEN
  }' --header 'Content-Type: application/json;charset=UTF-8'`;
  console.log("---请求如下----", command);
  exec(command)
    .then((response) => {
      console.log("请求 teamNotice 结果", response);
      log(response);
      return [response];
    })
    .catch((error) => {
      let errorText = "";
      try {
        errorText = JSON.stringify(error);
      } catch (stringifyError) {
        errorText = `Error stringifying error object: ${stringifyError.message}`;
      }
      const maskedError = errorText.replace(/AUTH_API_KEY: [\w-]+/g, 'KUNLUN: [MASKED]');
      log(maskedError);
      return [, error];
    });
}

module.exports = {
  kunlunNotice,
  domainErrorKunlunNotice,
};

/**params
 * https://k-devdoc.atlassian.net/wiki/spaces/AAPublicDocument/pages/188418260/API
 * tenant: kc-pro,
 * app:  project_name,
 * level: level,
 * message: text,
 * indicator //??? 用来区分告警的信息 ｜ ‘错误日志’
 * title: _message,
 * alarm_group: todo:kunlun创建值班组 "前端项目告警", 非必传，不传会发给app对应的负责人；传了该字段，会发给值班组中的值班人列表；必须先来昆仑平台创建对应的值班组才可以，否则报警无法发出！
 * notice_type: 默认按报警等级匹配发送方式：（CRITICAL：teams+短信+电话； INFO：teams+短信；NOTICE：teams）
 */

// const sit_token = "LSJ3WsFBcLzJkuGgOqieNQ5_SpBFHxPz"; //测试环境token
// const sit_api = "http://kunlun-hkidc-api.kucoin.net/api/external/alarm/alert"; //测试环境api
