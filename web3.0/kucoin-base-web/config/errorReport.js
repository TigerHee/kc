try {
  // 错误上报配置
  var CONFIG = {
    SOURCE_REPORT_DELAY: 1000, // 1秒防抖
    SOURCE_MAX_BATCH_SIZE: 10, // 最大批量上报数量
    WHITE_CHECK_DELAY: 5000, // 页面加载后检查白屏延迟
    POPSTATE_CHECK_DELAY: 3000, // popstate后检查白屏延迟
    CYCLE_RELOAD_THRESHOLD: 4, // 连续加载阈值
    CYCLE_RELOAD_INTERVAL: 10 * 1000, // 10秒内算作连续加载
    CYCLE_RELOAD_MAX_RECORDS: 20, // 最多保存多少条记录
    PAGE_LOAD_TIMES_PREFIX: 'kc__page_load_times__:', // 页面加载次数存储前缀
  };

  // 资源加载错误上报队列和防抖机制
  var sourceErrorQueue = [];
  var sourceErrorReportTimer = null;

  function getSite() {
    return window._BRAND_SITE_ || 'KC';
  }

  // 调用上报接口
  function sendReport(payload) {
    try {
      var headers = { type: 'application/json' };
      var blob = new Blob([JSON.stringify(payload)], headers);
      navigator.sendBeacon('/_api/polar/frontend/web_events/upload', blob);
    } catch (e) {
      console.error('sendReport error:', e);
    }
  }

  // 批量上报错误参数处理
  function batchReportErrors() {
    if (sourceErrorQueue.length === 0) return;

    var events = [];
    for (var i = 0; i < sourceErrorQueue.length; i++) {
      var error = sourceErrorQueue[i];
      events.push({
        event: 'web_resource_load_exception_count',
        timestamp: error.timestamp,
        value: 1,
        labels: {
          site: getSite(),
          source: error.source,
          country: '',
        },
      });
    }

    var batchPayload = {
      events: events,
    };

    sendReport(batchPayload);
    sourceErrorQueue = [];
  }

  // 添加错误到队列
  function addErrorToQueue(source) {
    if (sourceErrorReportTimer) {
      clearTimeout(sourceErrorReportTimer);
      sourceErrorReportTimer = null;
    }

    sourceErrorQueue.push({
      timestamp: Date.now(),
      source: source || 'unknown',
    });

    // 如果队列达到最大批量大小，立即上报
    if (sourceErrorQueue.length >= CONFIG.SOURCE_MAX_BATCH_SIZE) {
      batchReportErrors();
    } else {
      sourceErrorReportTimer = setTimeout(function () {
        batchReportErrors();
      }, CONFIG.SOURCE_REPORT_DELAY);
    }
  }

  // 检查是否白屏
  function isWhiteScreen() {
    try {
      var container = document.getElementById('root') || document.getElementById('__next');
      if (!container) {
        // 如果两个容器都不存在，判定为白屏
        return true;
      }

      // 兼容性处理：检查子元素数量
      var hasChildren = false;
      if (container.children && container.children.length) {
        hasChildren = container.children.length > 0;
      } else if (container.childNodes && container.childNodes.length) {
        // 降级到 childNodes
        hasChildren = container.childNodes.length > 0;
      }

      // 兼容性处理：检查文本内容
      var hasBodyText = false;
      if (container.textContent !== undefined) {
        hasBodyText = container.textContent.trim() !== '';
      } else if (container.innerText !== undefined) {
        hasBodyText = container.innerText.trim() !== '';
      }

      // 容子元素数量大于0 或者 innerText不为空 不是白屏
      if (hasChildren || hasBodyText) {
        return false;
      }

      return true;
    } catch (e) {
      console.error('isWhiteScreen error:', e);
      return false; // 出错时默认不是白屏，避免误报
    }
  }

  // 检查白屏并上报
  function checkWhiteScreen() {
    if (isWhiteScreen()) {
      var url = window.location.href;
      var payload = {
        events: [
          {
            event: 'web_page_white_count',
            timestamp: Date.now(),
            value: 1,
            labels: {
              site: getSite(),
              url: url,
              country: '',
            },
          },
        ],
      };

      sendReport(payload);
    }
  }

  /**
   * 检查网页无限reload
   * 单个 pathname 10s 内 加载 4 次就上报
   */
  function checkCycleReload() {
    try {
      var pathname = window.location.pathname;
      var key = CONFIG.PAGE_LOAD_TIMES_PREFIX + pathname;

      // 找出含有 PAGE_LOAD_TIMES_PREFIX 前缀的key
      var pageLoadKeys = [];
      for (var i = 0; i < sessionStorage.length; i++) {
        var storageKey = sessionStorage.key(i);
        if (storageKey && storageKey.indexOf(CONFIG.PAGE_LOAD_TIMES_PREFIX) === 0) {
          pageLoadKeys.push(storageKey);
        }
      }

      // 如果超过5个，删除除当前key以外的所有key
      if (pageLoadKeys.length >= 5) {
        for (var j = 0; j < pageLoadKeys.length; j++) {
          var storageKey = pageLoadKeys[j];
          if (storageKey !== key) {
            sessionStorage.removeItem(storageKey);
          }
        }
      }

      var times = JSON.parse(sessionStorage.getItem(key) || '[]');
      var now = Date.now();
      times.push(now);

      // 只保留最近10秒内的记录
      var filteredTimes = [];
      for (var i = 0; i < times.length; i++) {
        var t = times[i];
        if (now - t <= CONFIG.CYCLE_RELOAD_INTERVAL) {
          filteredTimes.push(t);
        }
      }
      times = filteredTimes;

      // 如果超过最大长度，截取最新的
      if (times.length > CONFIG.CYCLE_RELOAD_MAX_RECORDS) {
        times = times.slice(-CONFIG.CYCLE_RELOAD_MAX_RECORDS);
      }

      sessionStorage.setItem(key, JSON.stringify(times));

      if (times.length >= CONFIG.CYCLE_RELOAD_THRESHOLD) {
        sendReport({
          events: [
            {
              event: 'web_page_infinite_reload_count',
              timestamp: Date.now(),
              value: 1,
              labels: {
                site: getSite(),
                url: window.location.href,
              },
            },
          ],
        });

        // 上报后清空记录
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('checkCycleReload error === ', error);
    }
  }

  // 初始化检测
  function initReport() {
    // 检测无限reload
    checkCycleReload();

    // 检测资源加载异常
    window.addEventListener(
      'error',
      function (event) {
        try {
          if (
            event &&
            event.target &&
            event.target.tagName === 'SCRIPT' &&
            (event.target.src.indexOf('assets.staticimg.com') !== -1 ||
              event.target.src.indexOf(window.location.hostname) !== -1) &&
            event.target.src.indexOf('.js') !== -1
          ) {
            addErrorToQueue(event.target.src);
          }
        } catch (error) {
          console.error('error event handler error:', error);
        }
      },
      true,
    );

    // 页面加载 检测白屏
    window.addEventListener('load', function () {
      window.setTimeout(function () {
        checkWhiteScreen();
      }, CONFIG.WHITE_CHECK_DELAY); // 页面加载后 5 秒判断
    });

    // popstate 检测白屏
    window.addEventListener('popstate', function () {
      setTimeout(function () {
        checkWhiteScreen();
      }, CONFIG.POPSTATE_CHECK_DELAY);
    });

    // 监听 pushState 和 replaceState 的变化（通过重写方法实现）
    try {
      function wrapHistoryMethod(type) {
        var original = history[type];
        if (typeof original === 'function') {
          history[type] = function () {
            var result = original.apply(this, arguments);

            // 异步触发事件，避免阻塞
            setTimeout(function () {
              try {
                var e;

                // 优先使用现代方式
                if (typeof Event === 'function') {
                  e = new Event(type, { bubbles: false, cancelable: false });
                } else if (typeof document.createEvent === 'function') {
                  // 降级到传统方式（已弃用但兼容性最好）
                  e = document.createEvent('Event');
                  e.initEvent(type, false, false);
                }

                if (e) {
                  window.dispatchEvent(e);
                }
              } catch (err) {
                console.error('Failed to dispatch ' + type + ' event:', err);
              }
            }, 0);

            return result;
          };
        }
      }

      wrapHistoryMethod('pushState');
      wrapHistoryMethod('replaceState');

      // 监听自定义的 pushState 事件
      window.addEventListener('pushState', function (event) {
        setTimeout(function () {
          checkWhiteScreen();
        }, CONFIG.POPSTATE_CHECK_DELAY);
      });

      // 监听自定义的 replaceState 事件
      window.addEventListener('replaceState', function (event) {
        setTimeout(function () {
          checkWhiteScreen();
        }, CONFIG.POPSTATE_CHECK_DELAY);
      });
    } catch (e) {
      console.error('Failed to override history methods:', e);
    }
  }

  try {
    if (navigator.userAgent.indexOf('SSG_ENV') === -1) {
      initReport();
    }
  } catch (e) {
    console.error('Error report initialization failed:', e);
  }
} catch (error) {
  console.error(error);
}
