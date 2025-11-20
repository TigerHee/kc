/**
 * Owner: hanx.wei@kupotech.com
 */
const EventEmitter = require('events');
const PublicHandler = require('./public-web');
const TradeHandler = require('./trade-web');
const KucoinMainHandler = require('./kucoin-main-web');
const KucoinSeoHandler = require('./kucoin-seo-web');
const MarketingGrowthHandler = require('./marketing-growth-web');
const PoolXHandler = require('./pool-x-web');
const UcenterHandler = require('./ucenter-web');
const TradePublicHandler = require('./trade-public-web');
const ProfessionalWebHandler = require('./professional-web');
const OperationHandler = require('./platform-operation-web');
const CashbackHandler = require('./cashback-referral-web');

const PaymentWebHandler = require('./payment-web');
const SeoSitemapWebHandler = require('./seo-sitemap-web');
const MarginWebHandler = require('./margin-web-3.0');
const SeoLearnWebHandler = require('./seo-learn-web');
const CustomerWebHandler = require('./customer-web');
const BriskWebHandler = require('./brisk-web');
const KumexProHandler = require('./kumex-pro');
const SeoPriceWebHander = require('./seo-price-web');
const NewsWebHander = require('./news-web');
const SeoCmsWebHandler = require('./seo-cms-web');

class ProjectsHandler extends EventEmitter {
  constructor(configs, worker) {
    super();
    this['public-web'] = new PublicHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['trade-web'] = new TradeHandler(configs);
    this['kucoin-main-web'] = new KucoinMainHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['kucoin-seo-web'] = new KucoinSeoHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['marketing-growth-web'] = new MarketingGrowthHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['pool-x-web'] = new PoolXHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['ucenter-web'] = new UcenterHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['trade-public-web'] = new TradePublicHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['professional-web'] = new ProfessionalWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['platform-operation-web'] = new OperationHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['cashback-referral-web'] = new CashbackHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['payment-web'] = new PaymentWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['seo-sitemap-web'] = new SeoSitemapWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['margin-web-3.0'] = new MarginWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['seo-learn-web'] = new SeoLearnWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['customer-web'] = new CustomerWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['kumex-pro'] = new KumexProHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['brisk-web'] = new BriskWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['news-web'] = new NewsWebHander(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['seo-price-web'] = new SeoPriceWebHander(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this['seo-cms-web'] = new SeoCmsWebHandler(
      configs,
      worker.puppeteerManager,
      worker.messenger
    );
    this.on('stop', this.setProjectStopStatus.bind(this, true));
    this.on('reset-stop-status', this.setProjectStopStatus.bind(this, false));
  }

  setProjectStopStatus(status, { projectName }) {
    this[projectName].setStopStatus(status);
  }
}

module.exports = ProjectsHandler;
