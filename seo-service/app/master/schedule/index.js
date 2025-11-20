/**
 * Owner: hanx.wei@kupotech.com
 */
const nodeSchedule = require('node-schedule');
const checkCmsUpdate = require('./cms');
const hoursTasksSchedule = require('./hoursTasks');
const seoWebSechedule = require('./kucoin-seo-web');
const seoLearnWebSchedule = require('./seo-learn-web');
const newsWebSchedule = require('./news-web');

class Scheduler {
  constructor(master) {
    this.master = master;
  }

  register(isOffline) {
    if (isOffline) {
      console.log('offline env, do not run scheduler');
      return;
    }
    // utc 16; gtm 24
    nodeSchedule.scheduleJob('0 16 * * *', seoWebSechedule.bind(this));
    nodeSchedule.scheduleJob('5 16 * * *', seoLearnWebSchedule.bind(this));
    nodeSchedule.scheduleJob('20 16 * * *', newsWebSchedule.bind(this));
    // utc 0, 12; gtm 8, 20
    nodeSchedule.scheduleJob('10 5 */12 * * *', checkCmsUpdate.bind(this));
    // utc 0, 8, 16; gtm 8, 16 0
    nodeSchedule.scheduleJob('30 */8 * * *', hoursTasksSchedule.bind(this));
    // nodeSchedule.scheduleJob('*/5 * * * *', publicWebSchedule.bind(this));
  }
}

module.exports = Scheduler;
