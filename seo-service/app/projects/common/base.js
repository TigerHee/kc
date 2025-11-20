/**
 * Owner: hanx.wei@kupotech.com
 */
const logger = require('@app/worker/logger');
const genDetaultPages = require('./gen-default-pages');
const genDarkPages = require('./gen-dark-pages');
const genAppPages = require('./gen-app-pages');
const genAppDarkPages = require('./gen-app-dark-pages');

class BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    this.configs = configs;
    this.host = configs.host;
    this.appHost = configs.appHost;
    this.apiHost = configs.apiHost;
    this.cookieDomain = configs.cookieDomain;
    this.appCookieDomain = configs.appCookieDomain;
    this.langConfigs = configs.langs;
    this.puppeteerManager = puppeteerManager;
    this.messenger = messenger;
    this.stopFlag = false;
  }

  resolveResult(eventName, payload = {}) {
    payload.projectConfig = this.config;
    return {
      event: eventName,
      payload,
    };
  }

  setStopStatus(status) {
    this.stopFlag = status;
  }

  checkStopFlag(resetFlag = true) {
    logger.debug(`stop flag: ${this.stopFlag}`);
    if (this.stopFlag) {
      if (resetFlag) {
        // 默认这里重置，需要多次 check 最后 return 的场景传 resetFlag
        this.stopFlag = false;
      }
      logger.debug(`worker ${process.env.worker_index} send stopped message`);
      return true;
    }
    return false;
  }

  async genPages(params) {
    const { task } = params;
    const { theme, isApp } = task;
    let result = null;
    if (isApp === false) {
      switch (theme) {
        case 'light':
          result = await genDetaultPages.call(this, task);
          break;
        case 'dark':
          result = await genDarkPages.call(this, task);
          break;
        default:
          task.theme = 'light';
          result = await genDetaultPages.call(this, task);
          break;
      }
    } else {
      switch (theme) {
        case 'light':
          result = await genAppPages.call(this, task);
          break;
        case 'dark':
          result = await genAppDarkPages.call(this, task);
          break;
        default:
          task.theme = 'light';
          result = await genAppPages.call(this, task);
          break;
      }
    }
    if (this.checkStopFlag()) {
      return this.resolveResult('worker-handler-stopped');
    }
    return this.resolveResult('pages-gen', { result });
  }
}

module.exports = BaseProjectHandler;
