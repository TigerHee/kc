require('module-alias/register');
const crypto = require('crypto');
const configs = require('@scripts/config');
const tradeConfigs = require('@scripts/projects/trade-web');
const logger = require('./trade-web-logger');
const robot = require('@app/master/robot');
const TradeHandler = require('./index');

// entry 入口改为数组配置，不从 project config 里面取 entry
const entryTradeType = ['/trade', '/trade/margin', '/trade/isolated'];

async function tradeGen(tradeHandle, entryType) {
  try {
    const langs = process.argv.slice(2);

    const taskId = crypto.randomBytes(12).toString('hex');

    const {
      payload: { routes },
    } = await tradeHandle.genRoutes({ langs, entryTradeType: entryType });

    const routeObj = routes[0]; // routes只有一项

    for (let i = 0; i < langs.length; i++) {
      const task = {
        taskId,
        lang: langs[i],
        projectName: tradeConfigs.projectName,
        routes: routeObj.withoutLang,
        routeSetName: routeObj.routeSetName,
        priority: routeObj.priority,
        isApp: false,
        theme: 'light',
      };

      const {
        payload: {
          result: { total, failedUrls },
        },
      } = await tradeHandle.genPages({ task, entryTradeType: entryType });

      logger.info(
        `trade-web ${entryType} 子任务生成完成：${langs[i]}，总共：${total}，失败：${failedUrls.length}`
      );

      robot.info(
        `trade-web ${entryType} 子任务生成完成：${langs[i]}，总共：${total}，失败：${failedUrls.length}`
      );
    }
  } catch (err) {
    logger.error(`trade-web  ${entryType}  生成错误`, err);
    robot.error(`trade-web  ${entryType}  生成错误`, err);
    throw err; // 重新抛出错误，以便外部函数可以捕获
  }
}

// 使用 for...of 循环来遍历 entryTradeType 数组，并调用 tradeGen 方法

(async () => {
  const tradeHandle = new TradeHandler(configs); // 只创建一次 TradeHandler 实例
  try {
    for (const entryType of entryTradeType) {
      await tradeGen(tradeHandle, entryType);
    }
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
})();
