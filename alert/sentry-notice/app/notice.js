/**
 * Owner: derrick@kupotech.com
 */
const { log, error, configure } = require("./logger");
const getAuthToken = require("./token");
const escapeHtml = require("./escapeHtml");

// const token = process.env.TEAMS_VALID_TOKEN;
const _ = require('lodash');

// console.log(token, "token");

const exec = require("./utils");

// dev
const reqUrl = "https://kufox-bot.kcprd.com/api/notify";
const telReqUrl = "https://monitors-alert.kucoin.net/thirdpart/alert";

// production
// const reqUrl = "https://kufox-bot.phoenixfin.tech:3978/api/notify";

async function teamNotice(conversation, mentions, data) {
  const { project_name, level, url, message, bizType, event = {} } = data || {};

  let _message = message;
  if (!_message) {
    if (event && event.metadata) {
      _message = JSON.stringify({
        filename: event.metadata.filename,
        error: event.metadata.value,
      });
    }
  }

  let _request = JSON.stringify({
    url: event.request?.url || event.location,
    headers: JSON.stringify(event.request?.headers) || "",
  });

  let _user = JSON.stringify(event.user);

  let text = `<div>
    <p><span style="color: green">前端项目：</span> <span style="color: red">${project_name}</span></p>
    <p><span style="color: green">告警原因：</span> <span style="color: red">${escapeHtml(_message)}</span></p>
    <p><span style="color: green">请求详情：</span> <span style="color: red">${_request}</span> </p>
    <p><span style="color: green">用户信息</span> <span style="color: red">${_user}</span> </p>
    <p><span style="color: green">告警等级：</span> <span style="color: red">${level}</span> </p>
    <p><span style="color: green">详细链接：</span> <a style="color: red" href="${url}">查看日志</a></p>
  </div>`;
  if (bizType) {
    text = `
    <div>
    <p><span style="color: green">前端项目：</span> <span style="color: red">${project_name}</span></p>
    <p>
        <span style="color: green">业务类型：</span>
        <span style="color: red"> ${bizType}</span>
      </p>
    <p><span style="color: green">告警原因：</span> <span style="color: red">${escapeHtml(_message)}</span></p>
    <p><span style="color: green">告警等级：</span> <span style="color: red">${level}</span> </p>
    <p><span style="color: green">详细链接：</span> <a style="color: red" href="${url}">查看日志</a></p>
  </div>
    `;
  }

  const json = {
    receiver: {
      conversation: conversation,
    },
    message: {
      text: text,
      mentions: mentions,
    },
  };

  // console.log(JSON.stringify(json));

  const token = await getAuthToken();

  exec(
    `curl -k -X 'POST' https://kufox-bot.kcprd.com/api/notify -H 'Authorization:Bearer ${token}' -H 'Content-Type:application/json' -d '${JSON.stringify(
      json
    )}'`
  )
    .then((response) => {
      console.log('请求 teamNotice 结果', response);
      log(response);
      return [response];
    })
    .catch((error) => {
      console.log('请求 teamNotice 失败', error);
      log(error);
      return [, error];
    });
}

async function teamNoticeDomainErr(conversation, mentions, data, isCollection = false) {
  const { web_url, triggerRule } = data || {};

  // 普通上报
  let text = `<div>
    <p><span style="color: green">触发规则：</span> <span style="color: red">${triggerRule}</span> </p>
    <p><span style="color: green">规则详细链接：</span> <a style="color: red" href="${web_url}">查看日志</a></p>
  </div>`;
  // 集合上报
  if (isCollection) {
    let str = '';
    _.forEach(data, ({ triggerRule, web_url }) => {
      str += `<tr><td style="border: 1px solid #707070">${triggerRule}</td><td style="border: 1px solid #707070"><a style="color: red" href="${web_url}">查看日志</a></td></tr>`
    })
    text = `<table style="border-collapse: collapse border-spacing: 0">
      <tr style="background: #eee">
        <th>触发规则</th>
        <th>详细链接</th>
      </tr>
      ${str}
    </table>
    `;
  }

  const json = {
    receiver: {
      conversation: conversation,
    },
    message: {
      text: text,
      mentions: mentions,
    },
  };

  log(json);
  const token = await getAuthToken();

  return exec(
    `curl -k -X 'POST' https://kufox-bot.kcprd.com/api/notify -H 'Authorization:Bearer ${token}' -H 'Content-Type:application/json' -d '${JSON.stringify(
      json
    )}'`
  )
    .then((response) => {
      console.log('请求 teamNoticeDomainErr 结果', response);
      log(response);
      return [response];
    })
    .catch((error) => {
      console.log('请求 teamNoticeDomainErr 失败', error);
      log(error)
      return [, error];
    });
}

async function telNoticeDomainErr(conversation, tles = [], data) {
  const { project_name, url, message: messageProps, triggerRule, event } = data || {};
  const message = messageProps || _.get(event, 'metadata.value', '')

  let text = `<div>
    <p><span style="color: green">前端项目：</span> <span style="color: red">${project_name}</span></p>
    <p><span style="color: green">告警原因：</span> <span style="color: red">${message}</span></p>
    <p><span style="color: green">触发规则：</span> <span style="color: red">${triggerRule}</span> </p>
    <p><span style="color: green">详细链接：</span> <a style="color: red" href="${url}">查看日志</a></p>
  </div>`;

  const json = {
    "chatId": conversation,
    "message": text,
    "send2one": false,
    "text": false,
    "phone_numbers": tles
  }

  log(json)

  return exec(
    `curl -k -XPOST http://succade-webapi.kucoin.net/thirdpart/alert -H 'Content-Type:application/json' -d '${JSON.stringify(
      json
    )}'`
  )
    .then((response) => {
      console.log('请求 telNoticeDomainErr 结果', response);
      log(response)
      return [response];
    })
    .catch((error) => {
      console.log('请求 telNoticeDomainErr 失败', error);
      log(error);
      return [, error];
    });
}

module.exports = {
  teamNotice,
  teamNoticeDomainErr,
  telNoticeDomainErr,
};
