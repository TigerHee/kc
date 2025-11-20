/**
 * Owner: lori@kupotech.com
 */
import { Fragment } from 'react';
import { _t, _tHTML, addLangToPath } from 'tools/i18n';

// 申请原因key
export const REASON_KEY = {
  ADMIN_NOT_SUPPORT_CURRENCY_RETURN: 'ADMIN_NOT_SUPPORT_CURRENCY_RETURN',
  ADMIN_NOT_SUPPORT_CHAIN_RETURN: 'ADMIN_NOT_SUPPORT_CHAIN_RETURN',
  AIR_COIN: 'AIR_COIN', // 充值币种的链路不支持/充值链路币种不支持
  ADMIN_AIR_COIN: 'ADMIN_AIR_COIN', // 充值币种的链路不支持/充值链路币种不支持-人工找回
  MEMO_ABNORMAL: 'MEMO_ABNORMAL', // 充值時忘填或填錯標籤(Tag/Memo)
  ADMIN_MEMO_ABNORMAL: 'ADMIN_MEMO_ABNORMAL',
  ADMIN_MEMO_ABNORMAL_RETURN: 'ADMIN_MEMO_ABNORMAL_RETURN',
  ADMIN_MEMO_CORRECT: 'ADMIN_MEMO_CORRECT',
  ADMIN_DEPOSIT_OLD_ADDRESS_MEMO_ABNORMAL: 'ADMIN_DEPOSIT_OLD_ADDRESS_MEMO_ABNORMAL',
  ADMIN_DEPOSIT_PLATFORM_ADDRESS_ERROR: 'ADMIN_DEPOSIT_PLATFORM_ADDRESS_ERROR',
  ADMIN_DEPOSIT_HOT_WALLET: 'ADMIN_DEPOSIT_HOT_WALLET',
  ADMIN_DEPOSIT_HOT_WALLET_RETURN: 'ADMIN_DEPOSIT_HOT_WALLET_RETURN',
  ADMIN_WITHDRAW_HOT_WALLET: 'ADMIN_WITHDRAW_HOT_WALLET',
  ADMIN_WITHDRAW_OTHER_PLATFORM: 'ADMIN_WITHDRAW_OTHER_PLATFORM',
  ADMIN_DEPOSIT_CORRECT_CURRENCY: 'ADMIN_DEPOSIT_CORRECT_CURRENCY',
  ADMIN_DEPOSIT_OLD_ADDRESS: 'ADMIN_DEPOSIT_OLD_ADDRESS',
  ADMIN_CORSS_CHAIN_DEPOSIT: 'ADMIN_CORSS_CHAIN_DEPOSIT',
  ADMIN_DEPOSIT_FEE_ADDRESS_RETURN: 'ADMIN_DEPOSIT_FEE_ADDRESS_RETURN',
  ADMIN_ERROR_DEPOSIT_RETURN: 'ADMIN_ERROR_DEPOSIT_RETURN',
  ADMIN_CANT_TRANSFER_RETURN: 'ADMIN_CANT_TRANSFER_RETURN',
  ADMIN_DEPOSIT_RETURN: 'ADMIN_DEPOSIT_RETURN',
  ADMIN_WITHDRAW_RETURN: 'ADMIN_WITHDRAW_RETURN',
  ADMIN_DEPOSIT_FEE_ADDRESS_RETURN: 'ADMIN_DEPOSIT_FEE_ADDRESS_RETURN',
  ADMIN_TRANSFER_RETURN: 'ADMIN_TRANSFER_RETURN',
  ADMIN_TRANSFER_FEE_ADDRESS_RETURN: 'ADMIN_TRANSFER_FEE_ADDRESS_RETURN',
};

// 申请原因国际化
export const REASON_LIST = [
  {
    key: REASON_KEY.ADMIN_NOT_SUPPORT_CURRENCY_RETURN,
    name: _t('assetsRefund.fee.type1'),
  },
  {
    key: REASON_KEY.ADMIN_NOT_SUPPORT_CHAIN_RETURN,
    name: _t('assetsRefund.fee.type2'),
  },
  {
    key: REASON_KEY.MEMO_ABNORMAL,
    name: _t('assetsBack.reason1'),
    coinSelect: true, // 币种直接下拉选择,
    coinInput: false, // 币种直接输入
    des: (fee, style) => {
      const arr = [
        _t('assetsBack.reason1.des1'),
        _tHTML('assetsBack.reason1.des2', { style }),
        _tHTML('assetsBack.reason1.des3'),
      ];
      if (fee > 0) {
        arr.push(_tHTML('assetsBack.reason2.des3', { fee, style }));
      }
      return arr;
    },
    alertText: (style) => _tHTML('assetsBack.form.tips1', { style }),
    blockId: 'ForgetMemo',
    confirmModelDes: _t('assetsBack.reason1.confirmModelDes'),
  },
  {
    key: REASON_KEY.ADMIN_MEMO_ABNORMAL_RETURN,
    name: _t('assetsBack.reason1'),
  },
  {
    key: REASON_KEY.ADMIN_MEMO_ABNORMAL,
    name: _t('assetsRefund.fee.type4'),
  },
  {
    key: REASON_KEY.ADMIN_MEMO_CORRECT,
    name: _t('assetsRefund.fee.type5'),
  },
  {
    // 充值币种的链路不支持/充值链路币种不支持
    key: REASON_KEY.AIR_COIN,
    // key: REASON_KEY.MEMO_ABNORMAL,
    name: _t('assetsBack.cs.airCoin.title'),
    // coinSelect: true, // 币种直接下拉选择,
    // coinInput: false, // 币种直接输入
    des: (fee, style) => {
      const arr = [
        _tHTML('assetsBack.cs.airCoin.reason1', { style }),
        _tHTML('assetsBack.cs.airCoin.reason2', { style }),
      ];
      if (fee > 0) {
        arr.push(_tHTML('assetsBack.reason2.des3', { fee, style }));
      }
      return arr;
    },
    alertText: (style) => _t('assetsBack.form.tips2'),
    blockId: 'WrongChain',
    confirmAlertText: _t('assetsBack.cs.refundAddress.title.warn'),
    confirmModelDes: _tHTML('assetsBack.cs.airCoin.applyDes'),
    formList: [
      // {
      //   id: 'currencyInput',
      //   tipTitle: _t('assetsBack.form.tooltip1'), // '请通过下拉框选择您的充值币种或手动输入充值币种'
      //   childrenProps: {},
      // },
      'chain',
      'amount',
      'txId',
      'description',
      'contactInformation',
    ],
    detailList: [
      'reasonLabel',
      // 'coin',
      'chainName',
      'txID',
      'withdrawTxId',
      'refundTxId',
      'amount',
      'fee',
      'description',
    ],
  },
  {
    // 充值币种的链路不支持/充值链路币种不支持-人工找回
    key: REASON_KEY.ADMIN_AIR_COIN,
    // key: REASON_KEY.MEMO_ABNORMAL,
    name: _t('assetsBack.cs.airCoin.title'),
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_OLD_ADDRESS_MEMO_ABNORMAL,
    name: _t('assetsRefund.fee.type6'),
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_PLATFORM_ADDRESS_ERROR,
    name: _t('assetsRefund.fee.type7'),
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_HOT_WALLET,
    name: _t('assetsRefund.fee.type8'),
    passReason: '',
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_HOT_WALLET_RETURN,
    name: _t('assetsRefund.fee.type9'),
  },
  {
    key: REASON_KEY.ADMIN_WITHDRAW_HOT_WALLET,
    name: _t('assetsRefund.fee.type10'),
  },
  {
    key: REASON_KEY.ADMIN_WITHDRAW_OTHER_PLATFORM,
    name: _t('assetsRefund.fee.type11'),
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_CORRECT_CURRENCY,
    name: _t('assetsRefund.fee.type12'),
    passReason: '',
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_OLD_ADDRESS,
    name: _t('assetsRefund.fee.type13'),
  },
  {
    key: REASON_KEY.ADMIN_CORSS_CHAIN_DEPOSIT,
    name: _t('assetsRefund.fee.type14'),
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_FEE_ADDRESS_RETURN,
    name: _t('assetsRefund.fee.type15'),
  },
  {
    key: REASON_KEY.ADMIN_ERROR_DEPOSIT_RETURN,
    name: _t('assetsRefund.fee.type16'),
  },
  {
    key: REASON_KEY.ADMIN_CANT_TRANSFER_RETURN,
    name: _t('assetsRefund.fee.type177'),
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_RETURN,
    name: _t('assetsRefund.fee.type18'),
  },
  {
    key: REASON_KEY.ADMIN_WITHDRAW_RETURN,
    name: _t('assetsRefund.fee.type19'),
  },
  {
    key: REASON_KEY.ADMIN_DEPOSIT_FEE_ADDRESS_RETURN,
    name: _t('assetsRefund.fee.type20'),
  },
  {
    key: REASON_KEY.ADMIN_TRANSFER_RETURN,
    name: _t('assetsRefund.fee.type21'),
  },
  {
    key: REASON_KEY.ADMIN_TRANSFER_FEE_ADDRESS_RETURN,
    name: _t('assetsRefund.fee.type22'),
  },
];

// 根据申请单状态展示处理结果
export const AUDIT_RESULT = {
  WAIT_AUDIT: _t('assetsRefund.apply.result01'),
  USER_CANCEL_APPLY: _t('assetsRefund.apply.result02'),
  REFUND_FAIL: _tHTML('assetsRefund.apply.result03', { url: addLangToPath('/support') }),
};

export const TAG_CONFIG = {
  default: { color: '#2DBD96', bg: 'rgba(45, 189, 150, 0.06)' }, // 绿色
  finished: { color: 'rgba(0, 20, 42, 0.6)', bg: 'rgba(0, 20, 42, 0.06)' }, // 灰色
  fail: { color: '#F65454', bg: 'rgba(246, 84, 84, 0.08)' }, // 红色
  secondary: { color: '#FFB547', bg: 'rgba(255, 181, 71, 0.06)' }, // 橙色
};

export const TAGS = {
  WAIT_CONFIRM: { label: _t('assetsBack.feeStatus01'), type: 'secondary' }, // 待确认
  DEDUCTED: { label: _t('assetsBack.feeStatus02'), type: 'default' }, // 已扣除
  WAIT_DEDUCT: { label: _t('assetsBack.feeStatus03'), type: 'fail' }, // 未扣除
  NO_DEDUCTION: { label: _t('assetsBack.feeStatus04'), type: 'finished' }, // 无需手续费
  REFUNDED: { label: _t('assetsBack.feeStatus06'), type: 'finished' }, // 已退回
  DEDUCTED_FAIL: { label: _t('assetsBack.feeStatus05'), type: 'fail' }, // 扣除失败
  WAIT_AUDIT: { label: _t('assetsRefund.applyStatus01'), type: 'secondary' }, // 审核中
  AUDIT_PASS: { label: _t('assetsRefund.applyStatus02'), type: 'secondary' }, // 处理中
  REFUND_SUCCESS: { label: _t('assetsRefund.applyStatus03'), type: 'default' }, // 已完成
  USER_CANCEL_APPLY: { label: _t('assetsRefund.applyStatus04'), type: 'finished' }, // 取消申请
  REFUND_FAIL: { label: _t('assetsRefund.applyStatus06'), type: 'fail' }, // 退回失败
  AUDIT_REJECT: { label: _t('assetsRefund.applyStatus05'), type: 'fail' }, // 申请失败
  CUSTOMER_SERVICE_REJECT: { label: _t('assetsRefund.applyStatus05'), type: 'fail' }, // 申请失败
};

// 手续费状态：待确认/已扣除/未扣除/无需手续费/扣除失败
export const FEE_STATUS = {
  WAIT_CONFIRM: 'WAIT_CONFIRM', // 待确认
  WAIT_DEDUCT: 'WAIT_DEDUCT', // 未扣除
  DEDUCTED: 'DEDUCTED', // 已扣除
  NO_DEDUCTION: 'NO_DEDUCTION', // 无需扣除
  DEDUCTED_FAIL: 'DEDUCTED_FAIL', // 扣除失败
  REFUNDED: 'REFUNDED', // 已退回
};

// 申请单状态：审核中，处理中，已完成，取消申请，申请失败，退回失败
export const APPLY_STATUS = {
  WAIT_AUDIT: 'WAIT_AUDIT', // 审核中
  AUDIT_PASS: 'AUDIT_PASS', // 处理中
  REFUND_SUCCESS: 'REFUND_SUCCESS', // 已完成
  USER_CANCEL_APPLY: 'USER_CANCEL_APPLY', // 取消申请
  REFUND_FAIL: 'REFUND_FAIL', // 退回失败, 请联系客服
  AUDIT_REJECT: 'AUDIT_REJECT', // 申请失败-钱包那边失败
  CUSTOMER_SERVICE_REJECT: 'CUSTOMER_SERVICE_REJECT', // 申请失败-客户驳回
};
