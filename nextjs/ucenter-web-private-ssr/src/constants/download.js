// 月结单
export const ACCOUNT_STATEMENT_MONTHLY = 'ACCOUNT-STATEMENT-MONTHLY';
// 自定义时间
export const ACCOUNT_STATEMENT_CUSTOM = 'ACCOUNT-STATEMENT-CUSTOM';
// 账户结单
export const ACCOUNT_STATEMENT = 'ACCOUNT-STATEMENT';
// 账户结单二级code
export const ACCOUNT_STATEMENT_CODE = [ACCOUNT_STATEMENT_MONTHLY, ACCOUNT_STATEMENT_CUSTOM];

//  主站下载中心账单导出选项
export const globallBillExportOptions = (_t) => [
  {
    label: _t('uVHKyiQAuTcTATLS96i3sV'), // 账户明细
    code: 'DETAIL',
    isForSubAccount: true,
    children: [
      {
        label: _t('8NPdiAYTCW8KZbNe8Gi7cU'), // 资金账户
        code: 'MAIN-ACCOUNT-DETAILS',
      },
      {
        label: _t('5Gtxn17aZ9SJ1we3qKDZei'), // 币币账户
        code: 'TRADE-ACCOUNT-DETAILS',
      },
      {
        label: _t('4KNhzH1H1nHzZs5iJmFwW7'), // 杠杆全仓
        code: 'CROSS-MARGIN-ACCOUNT-DETAILS',
      },
      {
        label: _t('tzr88sB3z1v1iF8sRpJ7TY'), // 杠杆逐仓
        code: 'ISOLATED-MARGIN-ACCOUNT-DETAILS',
      },
    ],
  },
  {
    label: _t('gkELpNBmL24375A73Sc7iA'), // 充提记录
    code: 'INOUT',
    children: [
      {
        label: _t('eT64EtvAVGAAk1P42fKV9b'), // 充值记录
        code: 'INOUT-RECHARGE',
      },
      {
        label: _t('igo.nft.collection.withdrawRecord'), // 提现记录
        code: 'INOUT-WITHDRAW',
      },
    ],
  },
  {
    label: _t('eZhcjMpCcF52X2N4QRqfXp'), // 币币订单
    code: 'TRADE',
    isForSubAccount: true,
    children: [
      {
        label: _t('9CSj2u5F9sWQuRuD45gHQL'), // 历史委托
        code: 'TRADE-ENTRUST',
      },
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'TRADE-TRANS',
      },
    ],
  },
  {
    label: _t('t82K5EJ12n6EyY94gxQ84E'), // 杠杆订单
    code: 'LEVER',
    isForSubAccount: true,
    children: [
      {
        label: _t('9CSj2u5F9sWQuRuD45gHQL'), // 历史委托
        code: 'LEVER-ENTRUST',
        children: [
          {
            label: _t('inNj918MfrGGF6WQDPyued'), // 全仓
            code: 'LEVER-ENTRUST-ALL',
          },
          {
            label: _t('wNZVRa6vDpxE5fMcdXgQdG'), // 逐仓
            code: 'LEVER-ENTRUST-GRADUALLY',
          },
        ],
      },
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'LEVER-TRANS',
        children: [
          {
            label: _t('inNj918MfrGGF6WQDPyued'), // 全仓
            code: 'LEVER-TRANS-ALL',
          },
          {
            label: _t('wNZVRa6vDpxE5fMcdXgQdG'), // 逐仓
            code: 'LEVER-TRANS-GRADUALLY',
          },
        ],
      },
      {
        label: _t('qhW98kE73MhF7tjB1gdx78'), // 借出状况
        code: 'LEVER-LEND',
      },
      {
        label: _t('bHrQzZAZwb6GBgpf8vo1xc'), // 借入状况
        code: 'LEVER-BORROW',
        children: [
          {
            label: _t('inNj918MfrGGF6WQDPyued'), // 全仓
            code: 'LEVER-BORROW-ALL',
          },
          {
            label: _t('wNZVRa6vDpxE5fMcdXgQdG'), // 逐仓
            code: 'LEVER-BORROW-GRADUALLY',
          },
        ],
      },
    ],
  },
  {
    label: _t('mV652oJVxeofwf3dDYVUfi'), // 交易机器人
    code: 'ROBOT',
    children: [
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'ROBOT-TRANS',
        children: [
          {
            label: _t('xn91XmLgfQNcv79oVdNusK'), // 币币
            code: 'ROBOT-TRADE-TRANS',
          },
          {
            label: _t('oAsj7PXZjZdwa6RBaLCnNT'), // 合约
            code: 'ROBOT-KUMEX-TRANS',
          },
        ],
      },
    ],
  },
  {
    label: _t('vzpcKgTv1THLtbHXtKgmQG'), // 闪兑订单
    code: 'FLASH',
    isForSubAccount: true,
    children: [
      {
        label: _t('9CSj2u5F9sWQuRuD45gHQL'), // 历史委托
        code: 'FLASH-ENTRUST',
      },
    ],
  },
  {
    label: _t('kwANxXR7uPs2HeXNQc6a1n'), // 合约订单
    code: 'KUMEX',
    isForSubAccount: true,
    children: [
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'KUMEX-TRANS',
      },
      {
        label: _t('8JwUEoNcpLm9TfyU9qmKP3'), // 历史盈亏
        code: 'KUMEX-WIN',
      },
    ],
  },
  {
    label: _t('9UdKnUkMFivznF5APng8aT'), // 赚币订单
    code: 'EARN',
    children: [
      {
        label: _t('wQ7oAXoxy9jNhDMDzD4JoQ'), // 锁仓记录
        code: 'EARN-LOCK',
      },
      {
        label: _t('eVp9h7HgfDPHdQvziDDhvY'), // 收益记录
        code: 'EARN-WIN',
      },
    ],
  },
  {
    label: _t('nGfMLPTtVnnYcmFNk5qzQA'), // 法币订单
    code: 'FIAT',
    isForSubAccount: true,
    children: [
      {
        label: _t('uNwfvBx9wWHUwaBVmwRnAF'), // P2P订单
        code: 'FIAT-ORDERS-P2P-ORDERS',
      },
      {
        label: _t('feCutkn8BprR2nhgExzHy5'), // 法币充值记录
        code: 'FIAT-ORDERS-DEPOSIT-HISTORY',
      },
      {
        label: _t('7tq9cbi1ysfTME5TVsNJLu'), // 法币提现记录
        code: 'FIAT-ORDERS-WITHDRAWAL-HISTORY',
      },
      {
        label: _t('68bwHQvoeH2sUiPtWssRmU'), // 银行卡买币订单
        code: 'FIAT-ORDERS-BANK-CARD-ORDERS',
      },
      {
        label: _t('1L1XvR8MaD3nZAWAFQoNAy'), // 第三方买币订单
        code: 'FIAT-ORDERS-THIRD-PARTY-ORDERS',
      },
    ],
  },
  {
    label: _t('70370fe83d0d4800ac3c'), // 账户结单
    code: ACCOUNT_STATEMENT,
    isForSubAccount: true,
    tooltip: _t('cba014418cc14000a014'),
    children: [
      {
        label: _t('6148c9cdec2b4800a58a'), // 月结单
        code: ACCOUNT_STATEMENT_MONTHLY,
        // 月结单只能选月结单
        isExclusive: true,
      },
      {
        label: _t('3194862d03804800afae'), // 自定义时间
        code: ACCOUNT_STATEMENT_CUSTOM,
        // 自定义时间只能选自定义时间
        isExclusive: true,
      },
    ],
  },
  {
    label: _t('43nwjmbjD5Ji8cXcGC9K8N'), // 其他
    code: 'OTHER',
    isForSubAccount: true,
    children: [
      {
        label: _t('syiE3d7zEjgppyzRRXnB1n'), // 资产快照
        code: 'ASSET-SNAPSHOT',
      },
    ],
  },
];

// 其他站点下载中心账单导出选项
export const normalBillExportOptions = (_t) => [
  {
    label: _t('uVHKyiQAuTcTATLS96i3sV'), // 账户明细
    code: 'DETAIL',
    isForSubAccount: true,
    children: [
      {
        label: _t('8NPdiAYTCW8KZbNe8Gi7cU'), // 资金账户
        code: 'MAIN-ACCOUNT-DETAILS',
      },
      {
        label: _t('5Gtxn17aZ9SJ1we3qKDZei'), // 币币账户
        code: 'TRADE-ACCOUNT-DETAILS',
      },
      {
        label: _t('4KNhzH1H1nHzZs5iJmFwW7'), // 杠杆全仓
        code: 'CROSS-MARGIN-ACCOUNT-DETAILS',
      },
      {
        label: _t('tzr88sB3z1v1iF8sRpJ7TY'), // 杠杆逐仓
        code: 'ISOLATED-MARGIN-ACCOUNT-DETAILS',
      },
    ],
  },
  {
    label: _t('gkELpNBmL24375A73Sc7iA'), // 充提记录
    code: 'INOUT',
    children: [
      {
        label: _t('eT64EtvAVGAAk1P42fKV9b'), // 充值记录
        code: 'INOUT-RECHARGE',
      },
      {
        label: _t('igo.nft.collection.withdrawRecord'), // 提现记录
        code: 'INOUT-WITHDRAW',
      },
    ],
  },
  {
    label: _t('eZhcjMpCcF52X2N4QRqfXp'), // 币币订单
    code: 'TRADE',
    isForSubAccount: true,
    children: [
      {
        label: _t('9CSj2u5F9sWQuRuD45gHQL'), // 历史委托
        code: 'TRADE-ENTRUST',
      },
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'TRADE-TRANS',
      },
    ],
  },
  {
    label: _t('t82K5EJ12n6EyY94gxQ84E'), // 杠杆订单
    code: 'LEVER',
    isForSubAccount: true,
    children: [
      {
        label: _t('9CSj2u5F9sWQuRuD45gHQL'), // 历史委托
        code: 'LEVER-ENTRUST',
        children: [
          {
            label: _t('inNj918MfrGGF6WQDPyued'), // 全仓
            code: 'LEVER-ENTRUST-ALL',
          },
          {
            label: _t('wNZVRa6vDpxE5fMcdXgQdG'), // 逐仓
            code: 'LEVER-ENTRUST-GRADUALLY',
          },
        ],
      },
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'LEVER-TRANS',
        children: [
          {
            label: _t('inNj918MfrGGF6WQDPyued'), // 全仓
            code: 'LEVER-TRANS-ALL',
          },
          {
            label: _t('wNZVRa6vDpxE5fMcdXgQdG'), // 逐仓
            code: 'LEVER-TRANS-GRADUALLY',
          },
        ],
      },
      {
        label: _t('qhW98kE73MhF7tjB1gdx78'), // 借出状况
        code: 'LEVER-LEND',
      },
      {
        label: _t('bHrQzZAZwb6GBgpf8vo1xc'), // 借入状况
        code: 'LEVER-BORROW',
        children: [
          {
            label: _t('inNj918MfrGGF6WQDPyued'), // 全仓
            code: 'LEVER-BORROW-ALL',
          },
          {
            label: _t('wNZVRa6vDpxE5fMcdXgQdG'), // 逐仓
            code: 'LEVER-BORROW-GRADUALLY',
          },
        ],
      },
    ],
  },
  {
    label: _t('mV652oJVxeofwf3dDYVUfi'), // 交易机器人
    code: 'ROBOT',
    children: [
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'ROBOT-TRANS',
        children: [
          {
            label: _t('xn91XmLgfQNcv79oVdNusK'), // 币币
            code: 'ROBOT-TRADE-TRANS',
          },
          {
            label: _t('oAsj7PXZjZdwa6RBaLCnNT'), // 合约
            code: 'ROBOT-KUMEX-TRANS',
          },
        ],
      },
    ],
  },
  {
    label: _t('vzpcKgTv1THLtbHXtKgmQG'), // 闪兑订单
    code: 'FLASH',
    isForSubAccount: true,
    children: [
      {
        label: _t('9CSj2u5F9sWQuRuD45gHQL'), // 历史委托
        code: 'FLASH-ENTRUST',
      },
    ],
  },
  {
    label: _t('kwANxXR7uPs2HeXNQc6a1n'), // 合约订单
    code: 'KUMEX',
    isForSubAccount: true,
    children: [
      {
        label: _t('gYWNWmnUwgm4xuPwWjarU9'), // 历史成交
        code: 'KUMEX-TRANS',
      },
      {
        label: _t('8JwUEoNcpLm9TfyU9qmKP3'), // 历史盈亏
        code: 'KUMEX-WIN',
      },
    ],
  },
  {
    label: _t('9UdKnUkMFivznF5APng8aT'), // 赚币订单
    code: 'EARN',
    children: [
      {
        label: _t('wQ7oAXoxy9jNhDMDzD4JoQ'), // 锁仓记录
        code: 'EARN-LOCK',
      },
      {
        label: _t('eVp9h7HgfDPHdQvziDDhvY'), // 收益记录
        code: 'EARN-WIN',
      },
    ],
  },
  {
    label: _t('nGfMLPTtVnnYcmFNk5qzQA'), // 法币订单
    code: 'FIAT',
    isForSubAccount: true,
    children: [
      {
        label: _t('uNwfvBx9wWHUwaBVmwRnAF'), // P2P订单
        code: 'FIAT-ORDERS-P2P-ORDERS',
      },
      {
        label: _t('feCutkn8BprR2nhgExzHy5'), // 法币充值记录
        code: 'FIAT-ORDERS-DEPOSIT-HISTORY',
      },
      {
        label: _t('7tq9cbi1ysfTME5TVsNJLu'), // 法币提现记录
        code: 'FIAT-ORDERS-WITHDRAWAL-HISTORY',
      },
      {
        label: _t('68bwHQvoeH2sUiPtWssRmU'), // 银行卡买币订单
        code: 'FIAT-ORDERS-BANK-CARD-ORDERS',
      },
      {
        label: _t('1L1XvR8MaD3nZAWAFQoNAy'), // 第三方买币订单
        code: 'FIAT-ORDERS-THIRD-PARTY-ORDERS',
      },
    ],
  },
  {
    label: _t('43nwjmbjD5Ji8cXcGC9K8N'), // 其他
    code: 'OTHER',
    isForSubAccount: true,
    children: [
      {
        label: _t('syiE3d7zEjgppyzRRXnB1n'), // 资产快照
        code: 'ASSET-SNAPSHOT',
      },
    ],
  },
];
