/**
 * Owner: john.zhang@kupotech.com
 */
import { _t } from 'src/tools/i18n';

export const StepEnum = {
  Blocking: 1, // 无需迁移
  Entry: 2, // 迁移入口
  Transfer: 3, // 迁移表格页面
  Process: 4, // 迁移处理中
  Success: 5, // 迁移成功
  Failed: 6, // 迁移失败
};

export const HeaderDialogEnum = {
  Back: 1, // 返回
  Exit: 2, // 关闭
};

export const getAccountTypeInfo = (key) => {
  const map = {
    fait_currency: {
      value: 'fait_currency',
      desc: _t('ca733e5b04524000ac40'),
      tips: _t('3e6b274ca8304800a4f1'),
    },
    p2p: {
      value: 'p2p',
      desc: _t('955bf45f286a4800ab32'),
      tips: _t('63beb2a007904800ac8f'),
    },
    kucard: {
      value: 'kucard',
      desc: _t('54e71137fa4b4000a127'),
      tips: _t('3e6b274ca8304800a4f1'),
    },
    kucoin_card: {
      value: 'kucoin_card',
      desc: _t('64568d34ff0e4800af5f'),
      tips: _t('00f618fb22634800a944'),
    },
    kucoin_pay: {
      value: 'kucoin_pay',
      desc: _t('18224c9d02ba4000ac0d'),
      tips: _t('b22079d7d9474800af0e'),
    },
  };

  return map[key];
};

export const getOrderTypeInfo = (key) => {
  const map = {
    otc: {
      value: 'otc',
      desc: _t('76ed10ba80b14000a00d'),
    },
    kucoin_pay: {
      value: 'kucoin_pay',
      desc: _t('b03f3898b7284000aa5e'),
    },
    third_party: {
      value: 'third_party',
      desc: _t('76c1e294ed0b4800a87d'),
    },
    fast_buy: {
      value: 'fast_buy',
      desc: _t('b199f59735994000a478'),
    },
    grey_market: {
      value: 'grey_market',
      desc: _t('e2f16fae86414800a96e'),
    },
    fait_currency_recharge: {
      value: 'fait_currency_recharge',
      desc: _t('1f9caa7ef2a24000a211'),
    },
    fait_currency_withdraw: {
      value: 'fait_currency_withdraw',
      desc: _t('cc0ab66148274800a18a'),
    },
    crypto_assets_recharge: {
      value: 'crypto_assets_recharge',
      desc: _t('d944148d6a434800a39c'),
    },
    crypto_assets_withdraw: {
      value: 'crypto_assets_withdraw',
      desc: _t('3a37ffacd82c4800a621'),
    },
    migration_subscribe: {
      value: 'migration_subscribe',
      desc: _t('fc423fe6fa744000a55d'),
    },
    option_position: {
      value: 'option_position',
      desc: _t('9498e0223e764800ae0f'),
    },
    cloud_mining: {
      value: 'cloud_mining',
      desc: _t('85ce8a4d1d684000aea3'),
    },
  };

  return map[key];
};
