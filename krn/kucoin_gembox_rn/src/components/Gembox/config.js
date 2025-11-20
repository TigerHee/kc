/**
 * Owner: roger.chen@kupotech.com
 */
import {onExpose, onClickTrack} from 'utils/tracker';
import {Platform} from 'react-native';
import {getNativeInfo} from 'utils/helper';
import {forEach} from 'lodash';

export const pageId = 'B1gemboxHomepage';

export const _onExpose = ({blockId, locationId, properties}) => {
  onExpose({
    pageId,
    blockId,
    locationId,
    properties,
  });
};

export const _onClickTrack = ({
  blockId,
  locationId,
  properties,
  buttonName,
}) => {
  onClickTrack({
    pageId,
    blockId,
    locationId,
    properties,
    buttonName,
  });
};

const SYMBOL_ARRAY = ['.', '?', '!'];

export const FORMAT_TEXT = val => {
  if (!val) {
    return val;
  }
  const nativeInfo = getNativeInfo();
  const {lang} = nativeInfo || {};
  if (lang === 'ar_AE' && Platform.OS === 'android') {
    let str = val;
    const lastStr = val.substr(val.length - 1, 1);
    if (SYMBOL_ARRAY.indexOf(lastStr) > -1) {
      str = val.substr(0, val.length - 1);
    }
    return str;
  } else {
    return val;
  }
};

export const TRADE_TYPE_MAP = {
  BIG_MONEY: 'BIG_MONEY',
  PRO_TRADER: 'PRO_TRADER',
  BIG_ORDER: 'BIG_ORDER',
  ALL_TRADER: 'ALL_TRADER',
  BREAKING_NEWS: 'BREAKING_NEWS',
  HOT_TOPIC: 'HOT_TOPIC',
  MARKET_CHANGE: 'MARKET_CHANGE',
  NEW_CURRENCY_OPEN: 'NEW_CURRENCY_OPEN',
  SUDDEN_FALL: 'SUDDEN_FALL',
  SUDDEN_RISE: 'SUDDEN_RISE',
  BROADCAST: 'BROADCAST',
};

export const TRADE_TYPE_MAP_TEXT = {
  BREAKING_NEWS: 'TOPIC',
  HOT_TOPIC: 'TOPIC',
  MARKET_CHANGE: 'TOPIC',
  SUDDEN_RISE: 'SUDDEN_RISE',
  SUDDEN_FALL: 'SUDDEN_FALL',
  BIG_ORDER: 'BIG_ORDER',
  NEW_CURRENCY_OPEN: 'NEW_CURRENCY_OPEN',
};

export const _getData = (data, likeList) => {
  const topOneInfo = data && data[0] ? data[0] : {};
  const {highLights} = topOneInfo;
  const formatHighLights = _formatHighLights(highLights, likeList);
  const tabMap = highLights.filter(i => i.type === 'ALL_TRADER');
  return {
    topOneInfo: {...topOneInfo, highLights: formatHighLights},
    tabMap,
  };
};
export const _compare = (broadcast, broadcast_buy, broadcast_sell) => {
  return {
    getBuy: !broadcast.some(
      i =>
        i.tradeDirection === 'BUY' &&
        Number(i.param) === Number(broadcast_buy[0].param),
    ),
    getSell: !broadcast.some(
      i =>
        i.tradeDirection === 'SELL' &&
        Number(i.param) === Number(broadcast_sell[0].param),
    ),
  };
};
export const _formatHighLights = (list, likesList) => {
  let _highLights = list.map(i => {
    const {type, tradeDirection} = i;
    const newItem = {...i, likeCount: 0, isLike: false};
    likesList &&
      likesList.forEach(item => {
        if (type === item.highLight && tradeDirection === item.tradeDirection) {
          newItem.likeCount = item.likeCount;
          newItem.isLike = item.isLike;
        }
      });
    return newItem;
  });
  return _highLights.sort((a, b) => b.likeCount - a.likeCount);
};

export const _updatePercentNumber = val => {
  if (typeof val === 'number') {
    return;
  }
  let num = -1;
  if (val && val.indexOf('%') > 0) {
    num = val.split('%')[0];
    num = (Number(num) || 0) / 100;
  }
  return num;
};

export const _getHighLightsContent = list => {
  const array = [];
  forEach(list || [], item => {
    const {type} = item;
    if (TRADE_TYPE_MAP_TEXT[type]) {
      array.push(TRADE_TYPE_MAP_TEXT[type]);
    }
  });
  return array.join('/');
};

export const _getHighLightsParams = list => {
  const array = [];
  forEach(list || [], item => {
    const {type} = item;
    if (TRADE_TYPE_MAP_TEXT[type]) {
      array.push(TRADE_TYPE_MAP_TEXT[type]);
    }
  });
  return array.join('/');
};

export const _getHighLightsParamsObj = list => {
  let allItemAmount = '';
  let messageNumber = '';
  let replies = '';
  forEach(list || [], (item, index) => {
    const {type, tradeDirection, param} = item;
    const _param = _updatePercentNumber(param);
    if (type === 'ALL_TRADER' && tradeDirection === 'BUY') {
      allItemAmount = _param;
    } else if (type === 'BIG_MONEY' && tradeDirection === 'BUY') {
      messageNumber = _param;
    } else if (type === 'PRO_TRADER' && tradeDirection === 'BUY') {
      replies = _param;
    }
  });
  return {
    allItemAmount,
    messageNumber,
    replies,
  };
};
