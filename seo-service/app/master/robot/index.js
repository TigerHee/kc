/**
 * Owner: hanx.wei@kupotech.com
 */
const dayjs = require('dayjs');
const request = require('@utils/request');
const { robotConfig } = require('@scripts/config');

class Robot {
  constructor({ chatId, server }) {
    this.env = process.env.serverEnv || '';
    this.chatId = chatId;
    this.server = server;
    this.messages = [];
  }

  check() {
    // 30 秒一轮，检查消息合并推送
    setTimeout(() => {
      if (this.messages.length === 0) {
        this.check();
        return;
      }
      const message = this.messages.slice(0, 25).reduce((content, msg) => {
        if (msg.isHTML) {
          content += `${msg.datetime} ${msg.message}\n`;
        } else {
          content += `<div>${msg.datetime} ${msg.message}</div>\n`;
        }
        return content;
      }, '');
      this.messages = this.messages.slice(25);
      this.send(message);
      this.check();
    }, 30000);
  }

  send(message) {
    if (!this.env || /offline/i.test(this.env)) {
      console.log(message);
      return;
    }
    const chatId = this.chatId;
    request(`${this.server}/message/send`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message,
        send2one: true,
        text: false,
      }),
    }).catch(err => {
      console.log('Robot Error', err);
    });
  }

  info(message, isHTML = false) {
    this.messages.push({
      isHTML,
      message: `【${this.env}通知】: ${message}`,
      datetime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    });
  }

  error(message, isHTML = false) {
    this.messages.push({
      isHTML,
      message: `【${this.env}错误】: ${message}`,
      datetime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    });
  }

  warn(message, isHTML = false) {
    this.messages.push({
      isHTML,
      message: `【${this.env}警告】: ${message}`,
      datetime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    });
  }
}

const robot = new Robot(robotConfig);
robot.check();

module.exports = robot;
