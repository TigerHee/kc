/* eslint-disable func-names */
/*
 * @Author: Jessie
 * @Date: 2019-08-08 18:45:28
 * @Description: ''
 */


/*
	This class implements interaction with UDF-compatible datafeed.

	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF

  JS API:
  https://aitrade.ga/books/tradingview/book/JS-Api.html
*/
/* eslint-disable */

function parseJSONorNot(mayBeJSON) {
  if (typeof mayBeJSON === 'string') {
    return JSON.parse(mayBeJSON);
  } else {
    return mayBeJSON;
  }
}

const Datafeeds = {};
window._DataFeeds = Datafeeds;

Datafeeds.UDFCompatibleDatafeed = function (datafeedURL, updateFrequency) {
  this._datafeedURL = datafeedURL;
  this._configuration = undefined;

  this._symbolSearch = null;
  this._symbolsStorage = null;
  // 可使用心跳机制
  this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(
    this,
    updateFrequency || 10 * 1000,
  );
  // 关闭心跳机制
  // this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, -1);
  this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);

  this._enableLogging = false;
  this._initializationFinished = false;
  this._callbacks = {};

  this._initialize();
};



Datafeeds.UDFCompatibleDatafeed.prototype.destroy = function () {
  clearInterval(this._barsPulseUpdater.timer);
  clearInterval(this._quotesPulseUpdater.timer);
  clearInterval(this._quotesPulseUpdater.fastTimer);
};

Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
  return {
    supports_search: true,
    supports_group_request: false,
    supported_resolutions: [
      '1',
      '3',
      '5',
      '15',
      '30',
      '60',
      '120',
      '240',
      '360',
      '720',
      '1D',
      '1W',
      '1M',
    ],
    supports_marks: false,
    supports_timescale_marks: false,
  };
};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
  if (this._configuration.supports_time) {
    this._send(`${this._datafeedURL}/order-book/chart/time`, {})
      .then((response) => {
        callback(+response);
      })
      .catch(() => {});
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
  if (!this._callbacks.hasOwnProperty(event)) {
    this._callbacks[event] = [];
  }

  this._callbacks[event].push(callback);
  return this;
};

Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (
  event,
  argument,
) {
  if (this._callbacks.hasOwnProperty(event)) {
    const callbacksChain = this._callbacks[event];
    for (let i = 0; i < callbacksChain.length; ++i) {
      callbacksChain[i](argument);
    }

    this._callbacks[event] = [];
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
  this._initializationFinished = true;
  this._fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
  if (this._enableLogging) {
    const now = new Date();
    console.log(
      `${now.toLocaleTimeString()}.${now.getMilliseconds()}> ${message}`,
    );
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._send = function (url, params) {
  let request = url;
  if (params) {
    for (let i = 0; i < Object.keys(params).length; ++i) {
      const key = Object.keys(params)[i];
      const value = encodeURIComponent(params[key]);
      request += `${(i === 0 ? '?' : '&') + key}=${value}`;
    }
  }

  this._logMessage(`New request: ${request}`);

  var options = {
    credentials: 'same-origin',
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    },
  };
  return fetch(request, options).then(function (response) {
    return response.text();
  });
};

Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
  const that = this;

  this._send(`${this._datafeedURL}/order-book/chart/config`)
    .then((response) => {
      const configurationData = parseJSONorNot(response);
      that._setupWithConfiguration(configurationData);
    })
    .catch((reason) => {
      that._setupWithConfiguration(that.defaultConfiguration());
    });
};

Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
  const that = this;
  if (this._configuration) {
    setTimeout(() => {
      callback(that._configuration);
    }, 0);
  } else {
    this.on('configuration_ready', () => {
      callback(that._configuration);
    });
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (
  configurationData,
) {
  this._configuration = configurationData;

  if (!configurationData.exchanges) {
    configurationData.exchanges = [];
  }

  //	@obsolete; remove in 1.5
  const supportedResolutions =
    configurationData.supported_resolutions ||
    configurationData.supportedResolutions;
  configurationData.supported_resolutions = supportedResolutions;

  //	@obsolete; remove in 1.5
  const symbolsTypes =
    configurationData.symbols_types || configurationData.symbolsTypes;
  configurationData.symbols_types = symbolsTypes;

  if (
    !configurationData.supports_search &&
    !configurationData.supports_group_request
  ) {
    throw new Error(
      'Unsupported datafeed configuration. Must either support search, or support group request',
    );
  }

  if (!configurationData.supports_search) {
    this._symbolSearch = new Datafeeds.SymbolSearchComponent(this);
  }

  if (configurationData.supports_group_request) {
    //	this component will call onInitialized() by itself
    this._symbolsStorage = new Datafeeds.SymbolsStorage(this);
  } else {
    this.onInitialized();
  }

  this._fireEvent('configuration_ready');
  this._logMessage(`Initialized with ${JSON.stringify(configurationData)}`);
};

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

Datafeeds.UDFCompatibleDatafeed.prototype.getMarks = function (
  symbolInfo,
  rangeStart,
  rangeEnd,
  onDataCallback,
  resolution,
) {
  if (this._configuration.supports_marks) {
    this._send(`${this._datafeedURL}/order-book/marks`, {
      symbol: symbolInfo.ticker.toUpperCase(),
      from: rangeStart,
      to: rangeEnd,
      resolution,
    })
      .then((response) => {
        onDataCallback(parseJSONorNot(response));
      })
      .catch(() => {
        onDataCallback([]);
      });
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.getTimescaleMarks = function (
  symbolInfo,
  rangeStart,
  rangeEnd,
  onDataCallback,
  resolution,
) {
  if (this._configuration.supports_timescale_marks) {
    this._send(`${this._datafeedURL}/order-book/timescale_marks`, {
      symbol: symbolInfo.ticker.toUpperCase(),
      from: rangeStart,
      to: rangeEnd,
      resolution,
    })
      .then((response) => {
        onDataCallback(parseJSONorNot(response));
      })
      .catch(() => {
        onDataCallback([]);
      });
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.searchSymbols = function (
  searchString,
  exchange,
  type,
  onResultReadyCallback,
) {
  const MAX_SEARCH_RESULTS = 30;

  if (!this._configuration) {
    onResultReadyCallback([]);
    return;
  }

  if (this._configuration.supports_search) {
    this._send(`${this._datafeedURL}/order-book/search`, {
      limit: MAX_SEARCH_RESULTS,
      query: searchString.toUpperCase(),
      type,
      exchange,
    })
      .then((response) => {
        const data = parseJSONorNot(response);

        for (let i = 0; i < data.length; ++i) {
          if (!data[i].params) {
            data[i].params = [];
          }

          data[i].exchange = data[i].exchange || '';
        }

        if (typeof data.s === 'undefined' || data.s !== 'error') {
          onResultReadyCallback(data);
        } else {
          onResultReadyCallback([]);
        }
      })
      .catch((reason) => {
        onResultReadyCallback([]);
      });
  } else {
    if (!this._symbolSearch) {
      throw new Error(
        'Datafeed error: inconsistent configuration (symbol search)',
      );
    }

    const searchArgument = {
      searchString,
      exchange,
      type,
      onResultReadyCallback,
    };

    if (this._initializationFinished) {
      this._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
    } else {
      const that = this;

      this.on('initialized', () => {
        that._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
      });
    }
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._symbolResolveURL =
  '/currency/symbol-info';

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
) {
  const that = this;

  if (!this._initializationFinished) {
    this.on('initialized', () => {
      that.resolveSymbol(
        symbolName,
        onSymbolResolvedCallback,
        onResolveErrorCallback,
      );
    });

    return;
  }

  const resolveRequestStartTime = Date.now();
  that._logMessage('Resolve requested');

  function onResultReady(data) {
    let postProcessedData = data;
    postProcessedData.ticker = postProcessedData.name;
    // console.log('------------data-----------', postProcessedData);
    if (that.postProcessSymbolInfo) {
      postProcessedData = that.postProcessSymbolInfo(postProcessedData);
    }

    postProcessedData.has_weekly_and_monthly = true;

    that._logMessage(
      `Symbol resolved: ${Date.now() - resolveRequestStartTime}`,
    );

    onSymbolResolvedCallback(postProcessedData);
  }

  if (!this._configuration.supports_group_request) {
    this._send(this._datafeedURL + this._symbolResolveURL, {
      symbol: symbolName ? symbolName.toUpperCase() : '',
    })
      .then((response) => {
        const data = parseJSONorNot(response);

        if (!data.success) {
          onResolveErrorCallback('unknown_symbol');
        } else {
          onResultReady(data.data);
        }
      })
      .catch((reason) => {
        that._logMessage(`Error resolving symbol: ${JSON.stringify([reason])}`);
        onResolveErrorCallback('unknown_symbol');
      });
  } else if (this._initializationFinished) {
    this._symbolsStorage.resolveSymbol(
      symbolName,
      onResultReady,
      onResolveErrorCallback,
    );
  } else {
    this.on('initialized', () => {
      that._symbolsStorage.resolveSymbol(
        symbolName,
        onResultReady,
        onResolveErrorCallback,
      );
    });
  }
};


// 各个刻度下时间片的大小，单位秒
const timelineTypeSlice = {
  '1week': 302400000,
  '1day': 43200000,
  '12hour': 21600000,
  '8hour': 14400000,
  '6hour': 10800000,
  '4hour': 7200000,
  '2hour': 3600000,
  '1hour': 1800000,
  '30min': 1800000,
  '15min': 900000,
  '5min': 300000,
  '3min': 180000,
  '1min': 60000,
};


Datafeeds.UDFCompatibleDatafeed.prototype._historyURL = '/order-book/candles';

/**
 * 将时间处理成符合时间片
 *
 * @param   {[type]}  time   单位秒
 * @param   {[type]}  isUp   是否向上取数， 默认不
 *
 * @return  {[type]}         [return description]
 */
 function resolveTimeToRangeSlice(time, type, isUp = false) {
  const step = timelineTypeSlice[type];
  const nearTime = Math.floor(time / step) * step;
  return nearTime + (isUp ? step : 0);
}

/**
 * 时间切片后请求数据
 *
 * @return  {[type]}  [return description]
 */
 Datafeeds.UDFCompatibleDatafeed.prototype.timesliceBars = function (
   timeStart, timeEnd, type, symbol) {
  const self = this;

  const _nearStart = resolveTimeToRangeSlice(timeStart, type);
  const _nearEnd = resolveTimeToRangeSlice(timeEnd, type, true);

  const _step = timelineTypeSlice[type];
  const loopLen = (_nearEnd - _nearStart) / _step;
  const promisedArr = [];
  for (let i = 0; i < loopLen; i++) {
    promisedArr.push(_getBar(_nearStart + (i * _step), _nearStart + (i * _step) + _step));
  }

  return Promise.all(promisedArr)
  .then((values) => {
    const r = [];
    values.reverse().forEach((v) => {
      r.push(...(v.data || []));
    });
    return {
      data: r,
      msg: 'success',
      code: '200',
    };
  }, (err) => {
    throw err;
    // 一旦发生错误，则切回原有的请求模式
  })
  .catch((e) => {
    throw e;
  });


  function _getBar(_start, _end) {
    return new Promise((resolve, reject) => {
      self._send(self._datafeedURL + self._historyURL, {
        symbol,
		    type,
        begin: _start,
        end: _end,
      }).then((data) => {
        const nodata = !data.data || data.data.length === 0;
        // 由于是采用的分片，所以空数据暂时不处理，留到最后的数据处理流程部分
        if (data.code !== '200' && nodata) {
          reject({ data: [], error: new Error('failed or no data') });
          return;
        }
        resolve(data);
      }).catch((v) => {
        console.log('get bars failed', symbol, type, _start, _end);
        reject({ data: [], error: v });
      });
    });
  }
};

/**
 * 增加时间分片功能，当时间分片失败获取失败，则回退到原有的请求(getBarsOrigin);
 *
 * @return  {[type]}  [return description]
 */
Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (
  symbolInfo,
  resolution,
  rangeStartDate,
  rangeEndDate,
  onDataCallback,
  onErrorCallback,
  isPulse,
) {
  if (rangeStartDate > 0 && `${rangeStartDate}`.length > 10) {
    throw new Error([
      'Got a JS time instead of Unix one.',
      rangeStartDate,
      rangeEndDate,
    ]);
  }
  let type = '';
  if (resolution === '1D' || resolution === 'D') {
    type = '1day';
  } else if (resolution === '1W' || resolution === 'W') {
    type = '1week';
  } else {
    const resolutionNum = parseFloat(resolution);
    if (resolutionNum < 60) {
      type = `${resolution}min`;
    } else if (resolutionNum >= 60 && resolutionNum < 1440) {
      type = `${resolutionNum / 60}hour`;
    }
  }
  this.timesliceBars(rangeStartDate, rangeEndDate, type, symbolInfo.ticker.toUpperCase())
    .then((response) => {
      const data = parseJSONorNot(response);
      const nodata = !data.data || data.data.length === 0;

      if (data.code !== '200' && !nodata) {
        if (onErrorCallback) {
          onErrorCallback(data.msg);
        }

        return;
      }

      const bars = [];

      //	data is JSON having format {s: "status" (ok, no_data, error),
      //  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
      const barsCount = nodata ? 0 : data.data.length;

      // var volumePresent = typeof data.v != 'undefined';
      // var ohlPresent = typeof data.o != 'undefined';
      //   [
      //     "1545904980",             //Start time of the candle cycle
      //     "0.058",                  //opening price
      //     "0.049",                  //closing price
      //     "0.058",                  //highest price
      //     "0.049",                  //lowest price
      //     "0.018",                  //Transaction amount
      //     "0.000945"                //Transaction volume
      // ],

      for (let i = barsCount - 1; i >= 0; --i) {
        const item = data.data[i];
        // 校验是否是在合理的范围内的数据，不是的话则抛弃这些数据
        if (!isNaN(rangeStartDate) && (+item[0] < rangeStartDate || +item[0] > rangeEndDate)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const barValue = {
          time: parseFloat(item[0]) * 1000,
          close: parseFloat(item[2]),
        };

        if (item[1]) {
          barValue.open = parseFloat(item[1]);
          barValue.high = parseFloat(item[3]);
          barValue.low = parseFloat(item[4]);
        } else {
          barValue.open = barValue.high = barValue.low = barValue.close;
        }

        barValue.volume = parseFloat(item[6]);

        // barValue.turnover = parseFloat(item[6]);

        bars.push(barValue);
      }

      onDataCallback(bars, {
        noData: nodata,
        nextTime: data.nb || data.nextTime,
      });
    }, (arg) => {
      throw arg;
    })
    .catch((e) => {
      // 发生了失败，采用原有的请求
      this.getBarsOrigin(symbolInfo,
        resolution,
        rangeStartDate,
        rangeEndDate,
        onDataCallback,
        onErrorCallback,
        false,
        );
    })
    ;
};

/**
 * 原有的getBars 方法，留给 轮训使用，当拖动增加范围时，按照时间切片的方式提供
 * 当是轮训时，对rangeStartDate，rangeEndDate 处理至最近的一个节点上，增加缓存命中率
 *
 * @return  {[type]}  [return description]
 */
Datafeeds.UDFCompatibleDatafeed.prototype.getBarsOrigin = function (
  symbolInfo,
  resolution,
  rangeStartDate,
  rangeEndDate,
  onDataCallback,
  onErrorCallback,
  isPulse,
) {


  if (rangeStartDate > 0 && `${rangeStartDate}`.length > 10) {
    throw new Error([
      'Got a JS time instead of Unix one.',
      rangeStartDate,
      rangeEndDate,
    ]);
  }
  let type = '';
  if (resolution === '1D' || resolution === 'D') {
    type = '1day';
  } else if (resolution === '1W' || resolution === 'W') {
    type = '1week';
  } else {
    const resolutionNum = parseFloat(resolution);
    if (resolutionNum < 60) {
      type = `${resolution}min`;
    } else if (resolutionNum >= 60 && resolutionNum < 1440) {
      type = `${resolutionNum / 60}hour`;
    }
  }
  // 如果是轮训，那么需要处理参数，让参数保持到对应的格点上，多余的时间不足以产生数据，
  if (isPulse) {
    const _st = timelineTypeSlice[type] / 1000;
    if (rangeStartDate) {
      rangeStartDate -= ((rangeStartDate % _st));
    }
    rangeEndDate -= ((rangeEndDate % _st) - _st);

  }
  this._send(this._datafeedURL + this._historyURL, {
    symbol: symbolInfo.ticker.toUpperCase(),
    type,
    begin: isNaN(rangeStartDate) ? rangeEndDate : rangeStartDate, // begin为NaN,走请求成功的nodata流程
    end: rangeEndDate,
  })
    .then((response) => {
      const data = parseJSONorNot(response);
      const nodata = !data.data || data.data.length === 0;

      if (data.code !== '200' && !nodata) {
        if (onErrorCallback) {
          onErrorCallback(data.msg);
        }

        return;
      }

      const bars = [];

      //	data is JSON having format {s: "status" (ok, no_data, error),
      //  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
      const barsCount = nodata ? 0 : data.data.length;

      // var volumePresent = typeof data.v != 'undefined';
      // var ohlPresent = typeof data.o != 'undefined';
      //   [
      //     "1545904980",             //Start time of the candle cycle
      //     "0.058",                  //opening price
      //     "0.049",                  //closing price
      //     "0.058",                  //highest price
      //     "0.049",                  //lowest price
      //     "0.018",                  //Transaction amount
      //     "0.000945"                //Transaction volume
      // ],

      for (let i = barsCount - 1; i >= 0; --i) {
        const item = data.data[i];
        const barValue = {
          time: parseFloat(item[0]) * 1000,
          close: parseFloat(item[2]),
        };

        if (item[1]) {
          barValue.open = parseFloat(item[1]);
          barValue.high = parseFloat(item[3]);
          barValue.low = parseFloat(item[4]);
        } else {
          barValue.open = barValue.high = barValue.low = barValue.close;
        }

        barValue.volume = parseFloat(item[6]);

        // barValue.turnover = parseFloat(item[6]);

        bars.push(barValue);
      }

      onDataCallback(bars, {
        noData: nodata,
        nextTime: data.nb || data.nextTime,
      });
    })
    .catch((arg) => {
      console.warn(['getBars(): HTTP error', arg]);

      if (onErrorCallback) {
        onErrorCallback(`network error: ${JSON.stringify(arg)}`);
      }
    });
};

// Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
// 	this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
// };

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (
  listenerGUID,
) {
  this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (
  period,
  resolutionBack,
  intervalBack,
) {};

Datafeeds.UDFCompatibleDatafeed.prototype.getQuotes = function (
  symbols,
  onDataCallback,
  onErrorCallback,
) {
  this._send(`${this._datafeedURL}/order-book/chart/quotes`, { symbols })
    .done((response) => {
      const data = parseJSONorNot(response);
      if (data.s === 'ok') {
        //	JSON format is {s: "status", [{s: "symbol_status", n: "symbol_name", v: {"field1": "value1", "field2": "value2", ..., "fieldN": "valueN"}}]}
        if (onDataCallback) {
          onDataCallback(data.d);
        }
      } else if (onErrorCallback) {
        onErrorCallback(data.errmsg);
      }
    })
    .fail((arg) => {
      if (onErrorCallback) {
        onErrorCallback(`network error: ${arg}`);
      }
    });
};

Datafeeds.UDFCompatibleDatafeed.prototype.subscribeQuotes = function (
  symbols,
  fastSymbols,
  onRealtimeCallback,
  listenerGUID,
) {
  this._quotesPulseUpdater.subscribeDataListener(
    symbols,
    fastSymbols,
    onRealtimeCallback,
    listenerGUID,
  );
};

Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeQuotes = function (
  listenerGUID,
) {
  this._quotesPulseUpdater.unsubscribeDataListener(listenerGUID);
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol storage component for ExternalDatafeed. This component can
	  * interact to UDF-compatible datafeed which supports whole group info requesting
	  * do symbol resolving -- return symbol info by its name
*/
Datafeeds.SymbolsStorage = function (datafeed) {
  this._datafeed = datafeed;

  this._exchangesList = ['NYSE', 'FOREX', 'AMEX'];
  this._exchangesWaitingForData = {};
  this._exchangesDataCache = {};

  this._symbolsInfo = {};
  this._symbolsList = [];

  this._requestFullSymbolsList();
};

Datafeeds.SymbolsStorage.prototype._requestFullSymbolsList = function () {
  const that = this;

  for (let i = 0; i < this._exchangesList.length; ++i) {
    const exchange = this._exchangesList[i];

    if (this._exchangesDataCache.hasOwnProperty(exchange)) {
      continue;
    }

    this._exchangesDataCache[exchange] = true;

    this._exchangesWaitingForData[exchange] = 'waiting_for_data';

    this._datafeed
      ._send(`${this._datafeed._datafeedURL}/order-book/symbol_info`, {
        group: exchange,
      })
      .then(
        (function (exchange) {
          return function (response) {
            that._onExchangeDataReceived(exchange, parseJSONorNot(response));
            that._onAnyExchangeResponseReceived(exchange);
          };
        }(exchange)),
      )
      .catch(
        (function (exchange) {
          return function (reason) {
            that._onAnyExchangeResponseReceived(exchange);
          };
        }(exchange)),
      );
  }
};

Datafeeds.SymbolsStorage.prototype._onExchangeDataReceived = function (
  exchangeName,
  data,
) {
  // console.log('------------data _onExchangeDataReceived-----------', data);
  function tableField(data, name, index) {
    return data[name] instanceof Array ? data[name][index] : data[name];
  }

  try {
    for (var symbolIndex = 0; symbolIndex < data.symbol.length; ++symbolIndex) {
      const symbolName = data.symbol[symbolIndex];
      const listedExchange = tableField(data, 'exchange-listed', symbolIndex);
      const tradedExchange = tableField(data, 'exchange-traded', symbolIndex);
      const fullName = `${tradedExchange}:${symbolName}`;

      //	This feature support is not implemented yet
      //	var hasDWM = tableField(data, "has-dwm", symbolIndex);

      const hasIntraday = tableField(data, 'has-intraday', symbolIndex);

      const tickerPresent = typeof data.ticker !== 'undefined';
      const symbolInfo = {
        name: symbolName,
        base_name: [`${listedExchange}:${symbolName}`],
        description: tableField(data, 'description', symbolIndex),
        full_name: fullName,
        legs: [fullName],
        has_intraday: hasIntraday,
        has_no_volume: tableField(data, 'has-no-volume', symbolIndex),
        listed_exchange: listedExchange,
        exchange: tradedExchange,
        minmov:
          tableField(data, 'minmovement', symbolIndex) ||
          tableField(data, 'minmov', symbolIndex),
        minmove2:
          tableField(data, 'minmove2', symbolIndex) ||
          tableField(data, 'minmov2', symbolIndex),
        fractional: tableField(data, 'fractional', symbolIndex),
        pointvalue: tableField(data, 'pointvalue', symbolIndex),
        pricescale: tableField(data, 'pricescale', symbolIndex),
        type: tableField(data, 'type', symbolIndex),
        session: tableField(data, 'session-regular', symbolIndex),
        ticker: tickerPresent
          ? tableField(data, 'ticker', symbolIndex)
          : symbolName,
        timezone: tableField(data, 'timezone', symbolIndex),
        supported_resolutions:
          tableField(data, 'supported-resolutions', symbolIndex) ||
          this._datafeed.defaultConfiguration().supported_resolutions,
        force_session_rebuild:
          tableField(data, 'force-session-rebuild', symbolIndex) || false,
        has_daily: tableField(data, 'has-daily', symbolIndex) || true,
        intraday_multipliers: tableField(
          data,
          'intraday-multipliers',
          symbolIndex,
        ) || ['1', '5', '15', '30', '60'],
        has_fractional_volume:
          tableField(data, 'has-fractional-volume', symbolIndex) || false,
        has_weekly_and_monthly: true,
        has_empty_bars:
          tableField(data, 'has-empty-bars', symbolIndex) || false,
        volume_precision: tableField(data, 'volume-precision', symbolIndex) || 0,
      };

      this._symbolsInfo[symbolInfo.ticker] = this._symbolsInfo[
        symbolName
      ] = this._symbolsInfo[fullName] = symbolInfo;
      this._symbolsList.push(symbolName);
    }
  } catch (error) {
    throw new Error(
      `API error when processing exchange \`${exchangeName}\` symbol #${symbolIndex}: ${error}`,
    );
  }
};

Datafeeds.SymbolsStorage.prototype._onAnyExchangeResponseReceived = function (
  exchangeName,
) {
  delete this._exchangesWaitingForData[exchangeName];

  const allDataReady = Object.keys(this._exchangesWaitingForData).length === 0;

  if (allDataReady) {
    this._symbolsList.sort();
    this._datafeed._logMessage('All exchanges data ready');
    this._datafeed.onInitialized();
  }
};

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.SymbolsStorage.prototype.resolveSymbol = function (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
) {
  const that = this;

  setTimeout(() => {
    if (!that._symbolsInfo.hasOwnProperty(symbolName)) {
      onResolveErrorCallback('invalid symbol');
    } else {
      onSymbolResolvedCallback(that._symbolsInfo[symbolName]);
    }
  }, 0);
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol search component for ExternalDatafeed. This component can do symbol search only.
	This component strongly depends on SymbolsDataStorage and cannot work without it. Maybe, it would be
	better to merge it to SymbolsDataStorage.
*/

Datafeeds.SymbolSearchComponent = function (datafeed) {
  this._datafeed = datafeed;
};

//	searchArgument = { searchString, onResultReadyCallback}
Datafeeds.SymbolSearchComponent.prototype.searchSymbols = function (
  searchArgument,
  maxSearchResults,
) {
  if (!this._datafeed._symbolsStorage) {
    throw new Error(
      'Cannot use local symbol search when no groups information is available',
    );
  }

  const symbolsStorage = this._datafeed._symbolsStorage;

  const results = []; // array of WeightedItem { item, weight }
  const queryIsEmpty =
    !searchArgument.searchString || searchArgument.searchString.length === 0;
  const searchStringUpperCase = searchArgument.searchString.toUpperCase();

  for (let i = 0; i < symbolsStorage._symbolsList.length; ++i) {
    const symbolName = symbolsStorage._symbolsList[i];
    const item = symbolsStorage._symbolsInfo[symbolName];

    if (
      searchArgument.type &&
      searchArgument.type.length > 0 &&
      item.type !== searchArgument.type
    ) {
      continue;
    }

    if (
      searchArgument.exchange &&
      searchArgument.exchange.length > 0 &&
      item.exchange !== searchArgument.exchange
    ) {
      continue;
    }

    const positionInName = item.name
      .toUpperCase()
      .indexOf(searchStringUpperCase);
    const positionInDescription = item.description
      .toUpperCase()
      .indexOf(searchStringUpperCase);

    if (queryIsEmpty || positionInName >= 0 || positionInDescription >= 0) {
      let found = false;
      for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
        if (results[resultIndex].item === item) {
          found = true;
          break;
        }
      }

      if (!found) {
        const weight =
          positionInName >= 0 ? positionInName : 8000 + positionInDescription;
        results.push({ item, weight });
      }
    }
  }

  searchArgument.onResultReadyCallback(
    results
      .sort((weightedItem1, weightedItem2) => {
        return weightedItem1.weight - weightedItem2.weight;
      })
      .map((weightedItem) => {
        const item = weightedItem.item;
        return {
          symbol: item.name,
          full_name: item.full_name,
          description: item.description,
          exchange: item.exchange,
          params: [],
          type: item.type,
          ticker: item.name,
        };
      })
      .slice(0, Math.min(results.length, maxSearchResults)),
  );
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	This is a pulse updating components for ExternalDatafeed. They emulates realtime updates with periodic requests.
*/

Datafeeds.DataPulseUpdater = function (datafeed, updateFrequency) {
  this._datafeed = datafeed;
  this._subscribers = {};

  this._requestsPending = 0;
  const that = this;

  const update = function () {
    if (that._requestsPending > 0) {
      return;
    }
    for (var listenerGUID in that._subscribers) {
      // debugger;
      const subscriptionRecord = that._subscribers[listenerGUID];
      var resolution = subscriptionRecord.resolution;

      var datesRangeRight = parseInt(new Date().valueOf() / 1000);

      //	BEWARE: please note we really need 2 bars, not the only last one
      //	see the explanation below. `10` is the `large enough` value to work around holidays
      var datesRangeLeft =
        datesRangeRight - that.periodLengthSeconds(resolution, 10);

      that._requestsPending++;

      (function (_subscriptionRecord) {
        // eslint-disable-line
        that._datafeed.getBarsOrigin(
          _subscriptionRecord.symbolInfo,
          resolution,
          datesRangeLeft,
          datesRangeRight,
          (bars) => {
            that._requestsPending--;

            //	means the subscription was cancelled while waiting for data
            if (!that._subscribers.hasOwnProperty(listenerGUID)) {
              return;
            }

            if (bars.length === 0) {
              return;
            }

            const lastBar = bars[bars.length - 1];
            if (
              !isNaN(_subscriptionRecord.lastBarTime) &&
              lastBar.time < _subscriptionRecord.lastBarTime
            ) {
              return;
            }

            const subscribers = _subscriptionRecord.listeners;

            //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
            //	_subscriptionRecord.lastBarTime = NaN
            const isNewBar =
              !isNaN(_subscriptionRecord.lastBarTime) &&
              lastBar.time > _subscriptionRecord.lastBarTime;

            //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
            //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
            if (isNewBar) {
              if (bars.length < 2) {
                throw new Error(
                  'Not enough bars in history for proper pulse update. Need at least 2.',
                );
              }

              const previousBar = bars[bars.length - 2];
              for (var i = 0; i < subscribers.length; ++i) {
                subscribers[i](previousBar);
              }
            }

            _subscriptionRecord.lastBarTime = lastBar.time;

            for (var i = 0; i < subscribers.length; ++i) {
              subscribers[i](lastBar);
            }
          },

          //	on error
          () => {
            that._requestsPending--;
          },
          true, // isPulse
        );
      }(subscriptionRecord));
    }
  };
  this._update = update
  clearInterval(this.timer);
  if (typeof updateFrequency !== 'undefined' && updateFrequency > 0) {
    this.timer = setInterval(update, updateFrequency);
  }
};

Datafeeds.DataPulseUpdater.prototype.updatePoling = function (updateFrequency) {
  if(!this) return
  clearInterval(this.timer);
  if (typeof updateFrequency !== 'undefined' && updateFrequency > 0 && typeof this._update === 'function') {
    this.timer = setInterval(this._update, updateFrequency);
  }
}


Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function (
  listenerGUID,
) {
  this._datafeed._logMessage(`Unsubscribing ${listenerGUID}`);
  delete this._subscribers[listenerGUID];
};

Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function (
  symbolInfo,
  resolution,
  newDataCallback,
  listenerGUID,
) {
  this._datafeed._logMessage(`Subscribing ${listenerGUID}`);
  if (!this._subscribers.hasOwnProperty(listenerGUID)) {
    this._subscribers[listenerGUID] = {
      symbolInfo,
      resolution,
      lastBarTime: NaN,
      listeners: [],
    };
  }

  this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function (
  resolution,
  requiredPeriodsCount,
) {
  let daysCount = 0;

  if (resolution === 'D' || resolution === '1D') {
    daysCount = requiredPeriodsCount;
  } else if (resolution === 'W' || resolution === '1W') {
    daysCount = 7 * requiredPeriodsCount;
  } else if (resolution.indexOf('min') > -1) {
    const minData = resolution.split('min')[0];
    daysCount = (requiredPeriodsCount * parseInt(minData, 10)) / (24 * 60);
  } else if (resolution.indexOf('hour') > -1) {
    const minData = resolution.split('hour')[0];
    daysCount = (requiredPeriodsCount * parseInt(minData, 10)) / 24;
  } else {
    daysCount = (requiredPeriodsCount * parseInt(resolution, 10)) / (24 * 60);
  }
  if (isNaN(daysCount)) {
    try {
      const resolutionFromStorage = localStorage.getItem(
        'tradingview.chart.lastUsedTimeBasedResolution',
      );
      daysCount =
        (requiredPeriodsCount * parseInt(resolutionFromStorage, 10)) /
        (24 * 60);
    } catch (e) {
      daysCount = NaN;
    }
  }
  return daysCount * 24 * 60 * 60;
};

Datafeeds.QuotesPulseUpdater = function (datafeed) {
  this._datafeed = datafeed;
  this._subscribers = {};
  this._updateInterval = 60 * 1000;
  this._fastUpdateInterval = 10 * 1000;
  this._requestsPending = 0;

  const that = this;

  this.timer = setInterval(() => {
    that._updateQuotes((subscriptionRecord) => {
      return subscriptionRecord.symbols;
    });
  }, this._updateInterval);

  this.fastTimer = setInterval(() => {
    that._updateQuotes((subscriptionRecord) => {
      return subscriptionRecord.fastSymbols.length > 0
        ? subscriptionRecord.fastSymbols
        : subscriptionRecord.symbols;
    });
  }, this._fastUpdateInterval);
};

Datafeeds.QuotesPulseUpdater.prototype.subscribeDataListener = function (
  symbols,
  fastSymbols,
  newDataCallback,
  listenerGUID,
) {
  if (!this._subscribers.hasOwnProperty(listenerGUID)) {
    this._subscribers[listenerGUID] = {
      symbols,
      fastSymbols,
      listeners: [],
    };
  }

  this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.QuotesPulseUpdater.prototype.unsubscribeDataListener = function (
  listenerGUID,
) {
  delete this._subscribers[listenerGUID];
};

Datafeeds.QuotesPulseUpdater.prototype._updateQuotes = function (symbolsGetter) {
  if (this._requestsPending > 0) {
    return;
  }

  const that = this;
  for (const listenerGUID in this._subscribers) {
    this._requestsPending++;

    const subscriptionRecord = this._subscribers[listenerGUID];
    this._datafeed.getQuotes(
      symbolsGetter(subscriptionRecord),

      // onDataCallback
      (function (subscribers, guid) {
        // eslint-disable-line
        return function (data) {
          that._requestsPending--;

          // means the subscription was cancelled while waiting for data
          if (!that._subscribers.hasOwnProperty(guid)) {
            return;
          }

          for (let i = 0; i < subscribers.length; ++i) {
            subscribers[i](data);
          }
        };
      }(subscriptionRecord.listeners, listenerGUID)),
      // onErrorCallback
      (error) => {
        that._requestsPending--;
      },
    );
  }
};

if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = {
    UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed,
  };
}
