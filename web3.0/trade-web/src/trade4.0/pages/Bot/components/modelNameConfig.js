/**
 * Owner: mike@kupotech.com
 */

const config = {
  source: '',
  setSource(source) {
    this.source = source;
  },
  getModelName() {
    return this.source === 'orderCenter' ? 'BotMFInit' : 'symbols';
  },
};
export default config;
