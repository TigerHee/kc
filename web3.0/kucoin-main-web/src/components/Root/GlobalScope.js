/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Chrise
 * @Date: 2021-05-28 23:20:58
 * @FilePath: /kucoin-main-web/src/components/Root/GlobalScope.js
 */
import React from 'react';
import { connect } from 'react-redux';
import { TransferModal } from '@kucoin-biz/transfer';
import { withTheme } from '@kux/mui';

/**
 * 此组件进行全局数据轮训
 * 以及全局组件的渲染
 */

@withTheme
@connect((state) => {
  const { isLogin, user } = state.user;
  const { main, trade } = state.user_assets;
  const { isolatedSymbolsMap } = state.market;
  const { prices } = state.currency;
  const categories = state.categories;
  const isHFAccountExist = state.user_assets.isHFAccountExist;
  const { currentLang } = state.app;
  const {
    transferConfig: _transferConfig,
    batchFailedCurrencies,
    consolidationConfig,
    // concentrationConfig = {}
  } = state.transfer || {};
  const { visible, ...transferConfig } = _transferConfig || {};
  // const { visible: concentrationVisible } = concentrationConfig;
  const { visible: consolidationModalVisible, messageVisible: consolidationMessageVisible } =
    consolidationConfig;
  const loadedAssets = !!(isLogin && main.length && trade.length);

  return {
    loadedAssets,
    batchFailedCurrencies, // 划转失败提示弹窗
    consolidationConfigVisible: consolidationModalVisible || consolidationMessageVisible, // 归集弹窗
    categories,
    isHFAccountExist,
    userInfo: user,
    visible,
    transferConfig,
    isolatedSymbolsMap,
    currentLang,
    prices,
  };
})
export default class GlobalScope extends React.Component {
  componentDidMount() {}

  render() {
    const {
      loadedAssets,
      visible,
      consolidationConfigVisible,
      categories,
      isHFAccountExist,
      userInfo,
      transferConfig,
      dispatch,
      isolatedSymbolsMap,
      currentLang,
      prices,
      theme,
    } = this.props;
    return (
      <>
        {!!loadedAssets && (
          <TransferModal
            theme={theme.currentTheme}
            isHFAccountExist={isHFAccountExist}
            categories={categories}
            userInfo={userInfo}
            visible={visible}
            transferConfig={{
              ...transferConfig,
            }}
            isolatedSymbolsMap={isolatedSymbolsMap}
            currentLang={currentLang}
            prices={prices}
            onClose={() => {
              dispatch({
                type: `transfer/updateTransferConfig`,
                payload: {
                  visible: false,
                  callback: null,
                },
              });
            }}
            reOpen={() => {
              dispatch({
                type: `transfer/updateTransferConfig`,
                payload: {
                  visible: true,
                },
              });
            }}
          />
        )}
      </>
    );
  }
}
