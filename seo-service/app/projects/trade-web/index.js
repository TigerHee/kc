/**
 * Owner: Chelsey.Fan@kupotech.com
 */
const BaseProjectHandler = require('../common/base');
const genCurrencyPage = require('./gen-trade-pages');
const getAllLangsCurrency = require('./gen-trade-routes');
// const logger = require('@app/worker/logger');

class TradeHandler extends BaseProjectHandler {
  constructor(configs) {
    super(configs);
    this.config = configs.projectConfigs['trade-web'];
    this.entry = this.config.entry;
    this.siteUrl = new URL(`${this.host}${this.config.entry}`);
  }

  /**
   * currentRoutes = {
   *    withoutLang: [],
   *    withLang: null | { [lang]: [] },
   * }
   */
  async genRoutes(params) {
    let routes = [];
    const { withoutLang } = await getAllLangsCurrency(
      params.langs,
      this.apiHost,
      params.entryTradeType
    );
    routes = [
      {
        routeSetName: 'default',
        priority: 1,
        withoutLang,
        withLang: null,
      },
    ];
    if (this.stopFlag) {
      this.stopFlag = false;
      // logger.debug(`worker ${process.env.worker_index} send stopped message`);
      return this.resolveResult('worker-handler-stopped');
    }
    return this.resolveResult('routes-gen', { routes });
  }

  // trade 不区分 app/主题
  async genPages(params) {
    const { task } = params;
    const newSiteUrl = new URL(`${this.host}${params.entryTradeType}`);
    const result = await genCurrencyPage.call(this, task, {
      langs: this.langConfigs,
      ...this.config,
      entry: params.entryTradeType,
      siteUrl: newSiteUrl,
    });
    if (this.stopFlag) {
      this.stopFlag = false;
      // logger.debug(`worker ${process.env.worker_index} send stopped message`);
      return this.resolveResult('worker-handler-stopped');
    }
    return this.resolveResult('pages-gen', { result });
  }
}

module.exports = TradeHandler;
