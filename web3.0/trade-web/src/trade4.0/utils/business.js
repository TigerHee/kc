/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-10-06 20:30:34
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-28 18:56:36
 * @FilePath: /trade-web/src/trade4.0/utils/business.js
 * @Description:
 */
/**
 * Owner: odan.ou@kupotech.com
 */
import { getStore } from 'src/utils/createApp';
import { isDisplayAuction } from '@/meta/multiTenantSetting';

/**
 * 获取币对中关于集合竞价相关的信息
 * @param {Record<string, any>} symbolInfo
 */
export const getSymbolAuctionInfo = (
  symbolInfo,
  auctionWhiteAllowList,
  auctionWhiteAllowStatusMap,
) => {
  const {
    previewEnableShow: previewEnableShowProp, // 是否是预览界面
    isAuctionEnabled, // 是否开启集合竞价, 结束后会变成false(开启集合竞价且在连续交易前就为 true)
    isEnableAuctionTrade, // 是否开启集合竞价交易(下单)
    previewTime, // 页面预览时间
    auctionPreviewTime, // (集合竞价)页面预览时间
    previewRemainSecond, // 页面预览倒计时
    auctionPreviewRemainSecond, // (集合竞价)页面预览倒计时
    symbolCode,
  } = symbolInfo || {};

  // 多站点是否可以展示
  const isAuctionSiteShow = isDisplayAuction();
  // 处于集合竞价时再做判断
  let _isAuctionEnabled = isAuctionEnabled && isAuctionSiteShow;

  /**
   * ------------- 是否是集合竞价白名单用户 ----------------
   */
  try {
    if (_isAuctionEnabled) {
      // const auctionWhiteAllowList = getStore().getState().callAuction.auctionWhiteAllowList;
      // 是否开启集合竞价白名单，开启了才需要根据白名单用户显示
      if (auctionWhiteAllowList?.includes(symbolCode)) {
        _isAuctionEnabled = false; // 开启了白名单，默认false，白名单用户才显示true

        // const auctionWhiteAllowStatusMap =
        //   getStore().getState().callAuction.auctionWhiteAllowStatusMap;
        if (auctionWhiteAllowStatusMap[symbolCode]) {
          _isAuctionEnabled = true;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  // 是否预览页面
  // 集合竞价条件下需要满足 auctionPreviewRemainSecond > 0
  const previewEnableShow =
    previewEnableShowProp &&
    (!_isAuctionEnabled || (_isAuctionEnabled && auctionPreviewRemainSecond > 0));
  // 是否展示集合竞价
  const showAuction = !previewEnableShow && !!_isAuctionEnabled;
  // 是否允许集合竞价交易，在showAuction的情况下才行
  const allowAuctionTrade = showAuction && !!isEnableAuctionTrade;
  let auctionInfo;
  if (_isAuctionEnabled) {
    auctionInfo = {
      previewTime: auctionPreviewTime,
      previewRemainSecond: auctionPreviewRemainSecond,
    };
  }

  return {
    /**
     * 是否展示集合竞价
     */
    showAuction,
    /**
     * 是否允许集合竞价下单，是否允许集合竞价交易，在showAuction的情况下才行
     */
    allowAuctionTrade,
    previewTime,
    previewRemainSecond,
    previewEnableShow,
    isAuctionEnabled: _isAuctionEnabled,
    ...auctionInfo,
  };
};

/**
 * 获取 Model 中指定币对交易对的信息
 * @param {Record<string, any>} symbols
 * @param {string} symbol
 */
export const getModelSymbolInfo = (state, symbol) => {
  return state?.symbols?.symbolsMap?.[symbol] || {};
};

/**
 * 获取 Model 中指定币对集合竞价的信息
 * @param {*} state
 * @param {*} symbol
 */
export const getModelAuctionInfo = (state, symbol) => {
  const auctionWhiteAllowList = getStore().getState().callAuction.auctionWhiteAllowList || [];
  const auctionWhiteAllowStatusMap =
    getStore().getState().callAuction.auctionWhiteAllowStatusMap || {};
  return getSymbolAuctionInfo(
    getModelSymbolInfo(state, symbol),
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );
};
