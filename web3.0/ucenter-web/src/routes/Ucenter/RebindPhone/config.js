/**
 * Owner: willen@kupotech.com
 */
import googleImg from 'static/account/question/google.svg';
import googleUnImg from 'static/account/question/google_un.svg';
import passwordImg from 'static/account/question/password.svg';
import passwordUnImg from 'static/account/question/password_un.svg';
import { _t } from 'tools/i18n';

// 重置手机的所有选择配置
export const OPRIONTS_PHONE = {
  goole: {
    blockId: 'ChooseSecurityVerfication1',
    options: [
      {
        key: 'google',
        label: () => _t('selfService2.selectType.option8'),
        preImgs: [googleImg],
        blockId: 'ChooseSecurityVerfication11',
      },
      {
        key: 'google_unavailable',
        label: () => _t('selfService2.selectType.option9'),
        preImgs: [googleUnImg],
        blockId: 'ChooseSecurityVerfication12',
      },
    ],
  },
  trade: {
    blockId: 'ChooseSecurityVerfication2',
    options: [
      {
        key: 'trade',
        label: () => _t('selfService2.selectType.option6'),
        preImgs: [passwordImg],
        formatedTypes: [['withdraw_password']],
        blockId: 'ChooseSecurityVerfication21',
      },
      {
        key: 'trade_unavailable',
        label: () => _t('selfService2.selectType.option7'),
        preImgs: [passwordUnImg],
        formatedTypes: [['self_question']],
        blockId: 'ChooseSecurityVerfication22',
      },
    ],
  },
};

// 重置手机号不同校验类型的埋点
export const BLOCKIDS = new Map([
  [[['my_email']], 'SecurityVerfication1'],
  [[['withdraw_password']], 'SecurityVerfication2'],
  [[['my_email', 'withdraw_password']], 'SecurityVerfication3'],
]);
