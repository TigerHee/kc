/**
 * Owner: hanx.wei@kupotech.com
 */
const EventEmitter = require('events');
const puppeteer = require('puppeteer');
const logger = require('./logger');

// 重启 browser 阈值，执行该次数任务之后重启一次
const RELAUNCH_TASKS_LIMIT = 100;
// const ANDROID_APP_UA = 'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36 KuCoin/3.88.0';

const ABORT_REQUESTS = [
  'https://www.youtube.com',
  'bigdata-scfx-push.kucoin.plus',
  'www.google-analytics.com',
  'googleapis.com',
  'ggpht.com',
  'ytimg.com',
  'analytics.google.com',
  'analytics.twitter.com',
  't.co/i/adsct',
  'sentry-v2.staticimg.co',
  'bing.com',
  'connect.facebook.net',
  'facebook.com/tr',
  'socket.io',
  '/ads/ga-audiences',
  '/portal.php',
  '/bullet-usercenter',
  'doubleclick.net',
  'googleusercontent.com',
];

class PuppeteerManager extends EventEmitter {
  constructor(configs) {
    super();
    this.isTest = configs.isTest;
    this.pageCount = configs.pageCount;
    this.pageTimeout = 2 * 60 * 1000;
    this.browserWSEndpoint = '';
    this.browser = null;
    this.brContext = null; // 无痕浏览器上下文
    this.runTasksValue = 0; // 执行任务次数
    this.cookieDomain = configs.cookieDomain;
    this.appCookieDomain = configs.cookieDomain;
    this.MOCK_ENV_PC = 'pc';
    this.MOCK_ENV_MOBILE = 'mobile';
    this.MOCK_ENV_APP = 'app';
  }

  async start() {
    const browser = await this.launch();
    browser.disconnect();
    this.emit('puppeteer-start'); // only once
  }

  async launch() {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-zygote',
        // '--single-process', 无痕模式下启动该属性直接报错
        '--incognito', // 无痕模式
        '--ignore-certificate-errors',
      ],
      ignoreHTTPSErrors: true,
      defaultViewport: null,
    });
    const browserWSEndpoint = await browser.wsEndpoint();
    this.browserWSEndpoint = browserWSEndpoint;
    this.runTasksValue = 0;
    return browser;
  }

  async connect() {
    try {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: this.browserWSEndpoint,
      });
      this.brContext = await this.browser.createIncognitoBrowserContext();
    } catch (err) {
      this.browser = await this.launch();
      this.brContext = await this.browser.createIncognitoBrowserContext();
    }
  }

  async relaunch() {
    if (this.brContext) {
      await this.brContext.close();
      this.brContext = null;
    }
    if (this.browser) {
      await this.browser.close();
      await this.start();
    }
    this.emit('puppeteer-relaunched');
  }

  async closeBrowserContext() {
    if (this.brContext) {
      await this.brContext.close();
      this.brContext = null;
    }
    if (this.browser) {
      this.browser.disconnect();
    }
    this.emit('puppeteer-browsercontext-closed');
  }

  async finish() {
    // this.runTasksValue++; 这里先不重启
    if (this.runTasksValue === RELAUNCH_TASKS_LIMIT) {
      await this.relaunch();
    } else {
      await this.closeBrowserContext();
    }
  }

  async getBrowserPage(mockEnv) {
    if (!this.browser || !this.browser.isConnected()) {
      logger.error('get browser page error, browser is not connected');
      return;
    }
    if (!this.brContext) {
      this.brContext = this.browser.createIncognitoBrowserContext();
    }
    const page = await this.brContext.newPage();
    // page 基础设置
    if (mockEnv === this.MOCK_ENV_MOBILE) {
      const device = puppeteer.devices['iPhone 13 Pro'];
      // puppeteer.devices['Galaxy Note 3'];
      await page.setViewport(device.viewport);
      await page.setUserAgent(`${device.userAgent} SSG_ENV SSG_MOBILE_ENV`);
    } else if (mockEnv === this.MOCK_ENV_APP) {
      // 设置 App 环境
      const device = puppeteer.devices['iPhone 13 Pro'];
      await page.setViewport(device.viewport);
      await page.setUserAgent(
        `${device.userAgent} SSG_ENV SSG_MOBILE_ENV KuCoin`
      );
      // await page.setUserAgent(`${ANDROID_APP_UA} SSG_ENV`);
      // 覆写掉 prompt, jsbridge ios 通过 prompt 传递 message 阻塞渲染
      await page.evaluateOnNewDocument(() => {
        window.prompt = console.log;
      });
    } else {
      // default pc
      const UA = await this.browser.userAgent();
      await page.setUserAgent(`${UA} SSG_ENV`);
      await page.setViewport({ width: 1920, height: 768 });
    }
    // 设置访问 nginx 绕过 ssg 目录 cookie
    await page.setCookie({
      name: 'NOSSGMODE',
      value: 'true',
      domain:
        mockEnv !== this.MOCK_ENV_APP
          ? this.cookieDomain
          : this.appCookieDomain,
      session: true,
    });
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      const requestUrl = interceptedRequest.url();
      if (
        /\.(webp|eot|woff|woff2|ttf|svg|png|jpg|jpeg|gif|mp4|mp3|apk)$/.test(
          requestUrl
        ) ||
        /^data:/.test(requestUrl)
      ) {
        // 阻止不必要的资源请求
        interceptedRequest.abort();
      } else if (ABORT_REQUESTS.some(req => requestUrl.includes(req))) {
        interceptedRequest.abort();
      } else if (
        /ingest\.sentry\.io/.test(requestUrl) ||
        /mc\.yandex\.ru/.test(requestUrl)
      ) {
        interceptedRequest.abort();
      } else if (
        this.isTest &&
        (requestUrl.includes('google') ||
          requestUrl.includes('yandex-metrica-watch') ||
          requestUrl.includes('ab.kucoin.plus') ||
          requestUrl.includes(
            'kucoin-sitconfig.s3.ap-northeast-1.amazonaws.com'
          ))
      ) {
        // logger.debug(requestUrl);
        interceptedRequest.abort();
      } else {
        // logger.debug(requestUrl);
        interceptedRequest.continue();
      }
    });
    await page.evaluateOnNewDocument(() => {
      // 去掉语言缓存的读取，防止语言子路径自动跳转
      window.localStorage.getItem = key => {
        if (key === 'kucoinv2_lang') {
          return undefined;
        }
        return localStorage[key];
      };
    });

    // 调试用
    // page.on('console', msg => {
    //   if (msg.text().includes('SSG_ENV')) {
    //     console.log('PUPPETEER LOG', msg.text());
    //   }
    // });
    // page.on('console', message => {
    //   // console.log(message);
    //   logger.debug(`${message.type().substr(0, 3).toUpperCase()}: ${message.text()}`);
    //   // console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
    // });
    // page.on('pageerror', err => {
    //   // console.log(err);
    //   logger.debug(err.message);
    // });
    // page.on('response', response => {
    //   logger.debug(`${response.status()} ${response.url()}`);
    // });
    // page.on('requestfailed', request => {
    //   logger.debug(`${request.failure().errorText} ${request.url()}`);
    // });

    return page;
  }

  async getBrowserPages(count, mockEnv) {
    const pages = [];
    if (!this.browser || !this.browser.isConnected()) {
      logger.error('get browser pages error, browser is not connected');
      return pages;
    }
    for (let i = 0; i < count; i++) {
      const page = await this.getBrowserPage(mockEnv);
      pages.push(page);
    }
    return pages;
  }
}

module.exports = PuppeteerManager;
