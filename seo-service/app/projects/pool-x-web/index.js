/**
 * Owner: hanx.wei@kupotech.com
 */
const BaseProjectHandler = require('../common/base');

class PoolXHandler extends BaseProjectHandler {
  constructor(configs, puppeteerManager, messenger) {
    super(configs, puppeteerManager, messenger);
    this.config = configs.projectConfigs['pool-x-web'];
    this.entry = this.config.entry;
  }
}

module.exports = PoolXHandler;
