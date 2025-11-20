const schedule = require('node-schedule');
const _ = require('lodash');
const { monitorConfig } = require("./config");
const { domainErrorKunlunNotice } = require("./kunlun");
const { kunlunConvert } = require("./convertData");
const { error } = require("./logger");

/**
 * 普通上报限流
 *
 * @class Timer
 */
class Timer {

    constructor(){
        this.reportCount = 0;
        this.maxReport = 3;
        this.rule = '0 */1 * * *'; //  每小时执行一次
        this.schedule = null;
        this.cache = [];
        this.alreadyReport5XX = false; // 截流是否上报5XX
    }

    // 初始化配置
    init(options={}) {
        for (const key in options) {
            if (Object.hasOwnProperty.call(options, key)) {
                this[key] = options[key]
            }
        }
        this.createSchedule();
    }

    // 达到最大上报
    isMaxReport(){
        return this.reportCount >= this.maxReport;
    }

    // 上报自增1
    addReportCount() {
        this.reportCount = this.reportCount + 1;
        return true;
    }


    pushConfig(config){
        // 将数据push到缓存, 显示提取message，避免event对象改变
        this.cache.push({...config, message: config.message || _.get(config,'event.metadata.value','')});
    }

    // 创建循环定时器
    createSchedule() {
        const {conversation, domainMentions} = monitorConfig
        this.schedule = schedule.scheduleJob(this.rule, async()=>{
            // 如果存储数据，集合上报，之后重置参数
            if(Array.isArray(this.cache) && this.cache.length){
                const message = kunlunConvert(this.cache, true);
               const [res, err] = await domainErrorKunlunNotice(message, false);
               if(err || res.error) {
                error(res.error || err);
               }
            }
            this.clean();
        });
    }

    clean(){
        // 重置参数
        this.cache = [];
        this.reportCount = 0;
        this.alreadyReport5XX = false;
    }
}

const timer = new Timer();
timer.init();

module.exports = timer;