/**
 * Owner: derrick@kupotech.com
 */
const log4js = require('log4js');

let _logger = null;

/**
 * 初始化配置
 * @param {*} param0
 */
const configure = ({ logDir /* string */, logFile /* string */, isDebug/* boolean */ }) => {

    const useLogFile = !!logDir;
    let appenderFile = useLogFile ?  {
        fileLog: {
            type: 'dateFile',
            filename: typeof logFile === 'string' ? `${logDir}/${logFile}` : `${logDir}/out-log.log`,
            keepFileExt: true,
        },
    } : {};

    /*
      TRACE - ‘blue’
      DEBUG - ‘cyan’
      INFO - ‘green’
      WARN - ‘yellow’
      ERROR - ‘red’
      FATAL - ‘magenta’
     */
    log4js.configure({
        disableClustering: true,
        appenders: {
            out: { type: 'stdout' },
            ...appenderFile,
        },
        categories: {
            default: {
                appenders: useLogFile ?
                    (!!isDebug ?
                        ['fileLog', 'out'] : ['fileLog']):
                    ['out'],
                level: !!isDebug ? 'trace' : 'info',
            },
        },
    });

    _logger = log4js.getLogger();
};

/**
 * 生产日志函数
 */
const wrap = (type) => {

    return (...args) => {
        if (_logger === null) {
            throw new Error('Logger should be configured');
            return;
        }

        if (typeof _logger[type] === 'function') {
            _logger[type](...args);
        }
    };
};

const trace = wrap('trace');
const debug = wrap('debug');
const info = wrap('info');
const warn = wrap('warn');
const error = wrap('error');
const fatal = wrap('fatal');

module.exports = {
    configure,
    log: info,
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
};
