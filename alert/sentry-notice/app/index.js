/**
 * Owner: derrick@kupotech.com
 */
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { log, error, configure } = require("./logger");
const {
  teamNotice,
} = require("./notice");
const { kunlunNotice, domainErrorKunlunNotice } = require("./kunlun");
const {telConvert, kunlunConvert} = require('./convertData');
const each = require("lodash/each");
const find = require("lodash/find");
const { bizConfig, monitorConfig, bizConfigV2 } = require("./config");
const timer = require("./timer");
process.removeAllListeners("unhandledRejection");
process.on("unhandledRejection", processException);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const logDir = path.resolve(__dirname, "../var/log/kucoin/sentry-notice");

const { DEBUG = 1, PORT = 2999 } = process.env || {};

const reg = /\Country.*?\Rule/g;
const reg5XX = /^ERROR_5XX_CODE$/gi;

function processException(e) {
  log("PROCESS EXCEPTION");
  error(e);
}

configure({
  logDir,
  isDebug: !!DEBUG,
});

async function run() {
  const app = express();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

  app.post("/biz/notice", async function (req, res) {
    //kc-montior使用
    try {
      const body = req.body;
      const { data } = body;
      log(body);
      let showRequest = false;
      let hasCorrectRules = false;
      let triggerRule = "";
      let has5XXRule = false;

      let rule = String(data?.metric_alert?.title);

      if (rule.match(reg)) {
        triggerRule = rule;
        hasCorrectRules = true;
      } else if (rule.match(reg5XX)) {
        triggerRule = rule;
        has5XXRule = true;
        hasCorrectRules = true;
      }

      showRequest = hasCorrectRules;
      if (showRequest) {
        log("send request=====");
        const { conversation, domainMentions, tels } = monitorConfig;
        const bodyParams = {
          ...(data?.metric_alert || {}),
          triggerRule: triggerRule,
          web_url: data.web_url,
        };
        // 5xx Error code 重点提示，电话通知并发送teams, 5XX截流
        if (has5XXRule && !timer.alreadyReport5XX) {
          const message = telConvert(bodyParams);
          const [_, err] = await domainErrorKunlunNotice(message, true);
          if (err) {
            error(err);
          } else {
            timer.alreadyReport5XX = true;
          }
          // 普通的时间进入事件池子，进行截流上报
        } else {
          // 达到最大上报，推入池子
          if (timer.isMaxReport()) {
            timer.pushConfig(bodyParams);
            // 未达到最大值，直接上报
          } else {
            const message = kunlunConvert(bodyParams);
            const [_, err] = await domainErrorKunlunNotice(message, false);
            if (err) {
              error(err);
            } else {
              timer.addReportCount();
            }
          }
        }
      }
    } catch (e) {
      error(e);
    }
    res.sendStatus(200);
  });

  app.post("/biz/message", async function (req, res) {
    try {
      const body = req.body;
      const {
        level,
        event: { tags },
      } = body;

      const bizObj = find(tags, ([biz]) => biz === "biz");

      if (bizObj && level === "fatal") {
        const [__, bizCode] = bizObj;
        const { conversation } = bizConfig;
        const { mentions, bizType } = bizConfig[bizCode];
        const [_, err] = await teamNotice(conversation, mentions, {
          ...body,
          bizType,
        });
        if (err) {
          error(err);
        }
      }
    } catch (e) {
      error(e);
    }

    res.sendStatus(200);
  });

  app.post("/biz/test", async function (req, res) {
    try {
      console.log("request 进来了");
      const body = {
        level: "error",
        message: "sentry_node转发服务测试转发",
        url: "https://sentry-v2.staticimg.co/",
        bizType: "01",
        project_name: (req.body || {}).project_name,
      };
      const { conversation, mentions } = monitorConfig;
      await teamNotice(conversation, mentions, body);
    } catch (e) {
      log(e);
    } finally {
      res.sendStatus(200);
    }
  });

  app.post("/biz/request", async function (req, res) {
    try {
      const body = {
        level: (req.body || {}).level || "error",
        message: (req.body || {}).message || "出错啦",
        url: (req.body || {}).url || "https://sentry-v2.staticimg.co/",
        project_name: (req.body || {}).project_name,
      };
      const { event = {} } = req.body;
      const { tags = [] } = event;

      const bizObj = find(tags, ([biz]) => biz === "biz") || [];
      const [__, bizCode] = bizObj;
      const { conversation } = bizConfigV2;
      const { mentions = [], bizType = "01" } = bizConfigV2[bizCode] || {};
      await teamNotice(conversation, mentions, { ...body, bizType });
    } catch (e) {
      log(e);
    } finally {
      res.sendStatus(200);
    }
  });

  // https://sentry-notice.kucoin.net/notice?conversation=19:b5555b1ef1b144998e3dfef67dac37a4@thread.v2
  app.post("/notice", async function (req, res) {
    //sentry使用
    try {
      const body = req.body;
      const conversation = req.query ? req.query.conversation : null;
      if (conversation) {
        await teamNotice(conversation, [], body);
      }
    } catch (e) {
      error(e);
    }
    res.sendStatus(200);
  });

  // app.post("/kunlun/test", async function (req, res) {
  //   try {
  //     const body = {
  //       id: "67192030",
  //       project: "hybrid-h5",
  //       project_name: "hybrid-h5—test",
  //       project_slug: "hybrid-h5",
  //       logger: null,
  //       level: "warning",
  //       culprit: "https://www.kucoin.plus/earn/smart-earn",
  //       message:
  //         "服务端请求错误: GET 404 https://www.kucoin.com/_api_robot/cloudx-scheduler/v1/task/users/query?type=GRID&lang=zh_HK&c=7a27fc59c2b9451fa466220ad0d7b7a1",
  //       url: "https://www.kucoin.com/zh-hant/trading-bot/spot/grid/BTC-USDT",
  //       triggering_rules: ["测试alert名称"],
  //       event: {
  //         event_id: "1c48a0577daf4f9794a29fc8f0158894",
  //         logger: "",
  //         platform: "javascript",
  //         timestamp: 1732531017.24,
  //         received: 1732531026.380163,
  //         release: "hybrid-h5_3.8.53",
  //         environment: "prod",
  //         user: {
  //           id: "1",
  //           email: "test@kucoin.com",
  //           ip_address: "127.0.0.1",
  //           username: "test"
  //         },
  //         request: {
  //           url: 'https://www.kucoin.com/zh-hant/trading-bot/spot/grid/BTC-USDT',
  //           headers: 'header_test'
  //         },
  //       },
  //     };
  //     const noticeLevel = req.query ? req.query.noticeLevel : null; //告警等级
  //     const alertGroup = req.query ? req.query.alertGroup : null; //告警组
  //     const aggTime = req.query ? req.query.aggTime : null; //聚合时间
  //     await kunlunNotice(noticeLevel, alertGroup, aggTime,  body);
  //   } catch (e) {
  //     error(e);
  //   }
  //   res.sendStatus(200);
  // });
  app.post("/kunlun/notice", async function (req, res) {
    try {
      const body = req.body;
      const noticeLevel = req.query ? req.query.noticeLevel : null;//告警等级
      const alertGroup = req.query ? req.query.alertGroup : null;//告警组
      const aggTime = req.query ? req.query.aggTime : null; //聚合时间
      await kunlunNotice(noticeLevel, alertGroup, aggTime, body);
    } catch (e) {
      error(e);
    }
    res.sendStatus(200);
  });

  app.listen(PORT);

  console.log();
  console.log(`app listen ${PORT}`);
  console.log();
}

module.exports = {
  run,
};
