import remoteEvent from '@tools/remoteEvent';

// 检测Chrome插件
export default class ExtensionDetector {
  constructor() {
    this.defaultOpts = {
      whiteList: [], // 安全插件
      uid: null, // uid 可为空
      sence: 'auto', // 自定义 上报场景 默认自动上报
      event: 'PagePluginDetection', // 前后端约定好上报的event名称来区分数据来源
    };
    this.opts = { ...this.defaultOpts };
    this.cache = []; // 上次检测结果
    this.extensions = []; // 最新一次检测结果
  }

  init(config, autoReport = true) {
    this._updateOpts(config);
    if (autoReport) {
      this.detectAndReport(config); // 初始化 自动上报
    }
  }

  _updateOpts(config) {
    this.opts = { ...this.opts, ...config };
  }

  _detect() {
    const extensions = Array.from(document.scripts).filter((i) =>
      i.src.includes('chrome-extension'),
    );
    this.extensions = extensions
      .map((extension) => extension.src)
      .filter((extension) => !this.opts.whiteList.includes(extension));
  }

  async _report({ uid, sence }) {
    const token = await this._getFingerPrinter();
    const params = {
      pluginList: this.extensions,
      uploadTime: +new Date(),
      userAgent: navigator.userAgent,
      ...token,
      uid: uid || this.opts.uid,
      sence: sence || this.opts.sence,
    };
    remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
      sensors.track(this.opts.event, params);
      this.cache = this.extensions;
    });
  }

  async _getFingerPrinter() {
    let Report = null;

    remoteEvent.emit(remoteEvent.evts.GET_REPORT, (_Report) => {
      Report = _Report;
    });

    const token = await Report.logFingerprint(this.opts.event);
    // token重新取值
    let tokenObj = {};
    if (Object.prototype.toString.call(token) === '[object Object]') {
      tokenObj = {
        TOKEN: token?.token,
        TOKEN_SM: token?.token_sm,
      };
    } else {
      tokenObj = {
        TOKEN: token,
      };
    }
    return tokenObj;
  }

  // 获取插件列表
  getPluginList() {
    this._detect();
    return this.extensions;
  }

  // 检测并上报
  detectAndReport({ uid = null, sence = null } = {}) {
    this._detect();
    this._report({ uid, sence });
  }
}
