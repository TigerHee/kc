/**
 * Owner: john.zhang@kupotech.com
 */

import { moduleFederation } from '@kucoin-biz/common-base';
const { init, loadRemote } = moduleFederation;
init({
  //当前消费者的名称
  name: 'ucenter-web',
  // 依赖的远程模块列表
  remotes: [
    {
      // 生产者名字
      name: 'assets-web',
      // 生产者的模块联邦map文件
      entry: process.env.APP_MF_ASSETS_WEB_MAP,
      // 是否需要预加载资源，默认是false，可不填
      preload: false,
    },
  ],
});

let _UniversalTransferModal = null;
let _UniversalTransferMultiFailedModal = null;
let _SubMainAccount = null;
let _SubTradeAccount = null;
let _SubFuturesAccount = null;
let _SubOptionAccount = null;
let _SubMarginAccount = null;
let _WhtFormDialog = null;

const AssetsWebCompManager = {
  get SubMainAccount() {
    if (!_SubMainAccount) {
      _SubMainAccount = loadRemote('assets-web/SubMainAccount');
    }
    return _SubMainAccount;
  },
  get SubTradeAccount() {
    if (!_SubTradeAccount) {
      _SubTradeAccount = loadRemote('assets-web/SubTradeAccount');
    }
    return _SubTradeAccount;
  },
  get SubFuturesAccount() {
    if (!_SubFuturesAccount) {
      _SubFuturesAccount = loadRemote('assets-web/SubFuturesAccount');
    }
    return _SubFuturesAccount;
  },
  get SubMarginAccount() {
    if (!_SubMarginAccount) {
      _SubMarginAccount = loadRemote('assets-web/SubMarginAccount');
    }
    return _SubMarginAccount;
  },
  get SubOptionAccount() {
    if (!_SubOptionAccount) {
      _SubOptionAccount = loadRemote('assets-web/SubOptionAccount');
    }
    return _SubOptionAccount;
  },
  get UniversalTransferModal() {
    if (!_UniversalTransferModal) {
      _UniversalTransferModal = loadRemote('assets-web/UniversalTransferModal');
    }
    return _UniversalTransferModal;
  },
  get UniversalTransferMultiFailedModal() {
    if (!_UniversalTransferMultiFailedModal) {
      _UniversalTransferMultiFailedModal = loadRemote(
        'assets-web/UniversalTransferMultiFailedModal',
      );
    }
    return _UniversalTransferMultiFailedModal;
  },
  get WhtFormDialog() {
    if (!_WhtFormDialog) {
      _WhtFormDialog = loadRemote('assets-web/WhtFormDialog');
    }
    return _WhtFormDialog;
  },
};

export default AssetsWebCompManager;
