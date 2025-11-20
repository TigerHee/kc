const path = require('path');

module.exports = {
  replace: [
    ['WITHDRAW_CAPITUAL_MODEL_NAME', 'fiatWithdrawCapitual'],
    ['FIAT_WITHDRAW_MODEL_NAME', 'fiatWithdraw'],
    ['FIAT_CAPITUAL_MODEL_NAME', 'fiatChannelCapitual'],
  ],
  extraNamespaces: [
    {
      filename: path.resolve(__dirname, '../src/components/common/GeeTest.js'),
      namespaces: ['captcha'],
    },
    {
      filename: path.resolve(__dirname, '../src/hooks/useMarginConfig.js'),
      namespaces: ['marginConfig'],
    },
    {
      filename: path.resolve(__dirname, '../src/components/Assets/Withdraw/Table.js'),
      namespaces: ['withdraw'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/AssetsPage/CoinRecord/index.js'),
      namespaces: ['coin_in_record', 'coin_out_record', 'user', 'chainInfo'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/AssetsPage/KuxCoinRecord/index.js'),
      namespaces: ['coin_in_record', 'coin_out_record', 'transfer_record', 'user', 'chainInfo'],
    },
    {
      filename: path.resolve(__dirname, '../src/components/Assets/RecordDetail/index'),
      namespaces: ['coin_out_record'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/Current/index.js'),
      namespaces: ['order_current'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/DealDetail/index.js'),
      namespaces: ['order_deal_detail', 'user'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/History/index.js'),
      namespaces: ['order_history'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/Stop/index.js'),
      namespaces: ['order_stop'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/Borrowing/index.js'),
      namespaces: ['borrowing'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/Repayment/index.js'),
      namespaces: ['repayment'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/Interest/index.js'),
      namespaces: ['interest'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/Liquidation/index.js'),
      namespaces: ['liquidation'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/Convert/index.js'),
      namespaces: ['order_convert', 'order_convertcurrent', 'order_convertlimit'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/RecordsV1/config.js'),
      namespaces: ['deposits_record', 'withdraw_record'],
    },
    {
      filename: path.resolve(
        __dirname,
        '../src/routes/AssetsPage/FiatCurrency/Recharge/channels/capitual/CapitualPaymentDetail.js',
      ),
      namespaces: ['fiatChannelCapitual'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OtcPage/OrderDetail/Details.js'),
      namespaces: ['security_new'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/AssetsPage/Withdraw/withdrawCoin.js'),
      namespaces: ['chainInfo'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/RecordsV1/index.js'),
      namespaces: ['deposits_record', 'withdraw_record'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/AccountPage/SubAccount/index.js'),
      namespaces: ['security_new'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/SubscribeRecord/index.js'),
      namespaces: ['order_history', 'order_current'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OtcPage/Payments/AddPayment/index.js'),
      namespaces: ['security_new'],
    },
    {
      filename: path.resolve(
        __dirname,
        '../src/routes/AssetsPage/FiatCurrency/Recharge/channels/checkout/BankCardSelector',
      ),
      namespaces: ['fiatWithdraw'],
    },
    {
      filename: path.resolve(
        __dirname,
        '../src/routes/AssetsPage/FiatCurrency/Recharge/channels/capitual/CapitualKycStatus',
      ),
      namespaces: ['fiatChannelCapitual'],
    },
    {
      filename: path.resolve(
        __dirname,
        '../src/routes/AssetsPage/FiatCurrency/Recharge/channels/capitual/CapitualKycForm',
      ),
      namespaces: ['fiatChannelCapitual'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/OrderPage/SubscribeRecord/index.js'),
      namespaces: ['order_current', 'order_history'],
    },
    {
      filename: path.resolve(__dirname, '../src/routes/AssetsPage/EarnAccount/RatesBond/index.js'),
      namespaces: ['pool_staking'],
    },
    {
      filename: path.resolve(__dirname, '../src/__models/captcha.js'),
      namespaces: ['selfService'],
    },
    {
      filename: path.resolve(__dirname, '../src/hooks/useOpenFuturesIsBonus.js'),
      namespaces: ['open_futures']
    }
  ],
  ignore: [
    'common/models',
    '__models/base/security_base',
    'Security/BindG2afPage',
    'SecurityForm/BindPhoneForm',
    'SecurityForm/BindEmailForm',
    'common/GeeTest',
    'components/Authentication',
    'OtcPage/OrderDetail/Details',
    'Withdraw/withdrawCoin',
    'Margin/Borrow',
    'LeveragedTokens/ApplyModal',
    'WithdrawAddrManage/modalAdd',
    'hooks/useMarginConfig',
    'components/Overview',
    'account/subAccount',
    'TransferModal/Tips',
    'Template/AirdropUSDT',
    'hocs/record',
    'routes/RecordsV1',
    'AssetsPage/Withdraw',
    'AssetsPage/CoinRecord',
    'FiatCurrency/Withdraw',
    'hocs/withMarginConfig',
    'components/CommonFunctions',
    'Referral/Manage/InviteList',
    'Assets/Withdraw/ModalAdd',
    'OtcPage/PublishAds/Form',
    'Assets/AccountRecord',
    'components/CommonSecurity',
    'OtcPage/UserOrders',
    'AccountPage/SubAccount',
    'Margin/LendForm',
    'Assets/RecordDetail',
    'Margin/RepayModal',
    'Margin/DebtStats',
    'Coin/CoinIn',
    'Payments/AddPayment',
    'Recharge/channels/capitual',
    'checkout/BankCardSelector',
    'capitual/CapitualPaymentDetail',
    'capitual/CapitualKycStatus',
    'capitual/CapitualKycForm',
    'OrderPage/SubscribeRecord',
    'EarnAccount/RatesBond',
    'Withdraw/components/ModalAdd',
    'SelfServicePage/ReasetG2faPage',
    'NewCommonSecurity/index',
    '__models/captcha',
    'components/NewAuthentication/index',
    'plugins/showError',
    'routes/SpotNFTPage/Collection',
    'routes/SpotNFTPage/Distribute/BidRecordMobile',
    'hooks/useOpenFuturesIsBonus'
    // 'fiat/channels/capitual',
    // 'Authentication/index',
    // 'security_base',
    // 'account/subAccount',
    // 'WithdrawResult/index',
    // 'fiat/fiatWithdraw',
    // 'Withdraw/channels/sepa/WithdrawAccountSelect',
    // 'Withdraw/channels/sepa/AddAccountModal',
    // 'Withdraw/WithdrawRecordTable',
  ],
};
