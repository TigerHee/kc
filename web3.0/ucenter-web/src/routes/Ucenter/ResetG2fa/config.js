/**
 * Owner: willen@kupotech.com
 */
import emailImg from 'static/account/question/email.svg';
import passwordImg from 'static/account/question/password.svg';
import phoneImg from 'static/account/question/phone.svg';
import noPhoneImg from 'static/account/question/phone_unavailable.svg';
import plusImg from 'static/account/question/plus.svg';
import { _t } from 'tools/i18n';

export const OPTIONS_GOOGLE = new Map([
  // 仅绑定手机
  [
    [['my_sms'], ['self_question']],
    {
      blockId: 'ChooseSecurityVerfication2',
      options: [
        {
          key: 'my_sms',
          label: () => _t('selfService2.selectType.option1'),
          preImgs: [phoneImg],
          formatedTypes: [['my_sms']],
          blockId: 'ChooseSecurityVerfication21',
        },
        {
          key: 'self_question',
          label: () => _t('selfService2.selectType.option2'),
          preImgs: [noPhoneImg],
          formatedTypes: [['self_question']],
          blockId: 'ChooseSecurityVerfication22',
        },
      ],
    },
  ],
  // 仅绑定手机+邮箱
  [
    [['my_email'], ['my_sms']],
    {
      blockId: 'ChooseSecurityVerfication1',
      options: [
        {
          key: 'my_sms',
          label: () => _t('selfService2.selectType.option1'),
          preImgs: [phoneImg],
          formatedTypes: [['my_sms']],
          blockId: 'ChooseSecurityVerfication12',
        },
        {
          key: 'my_email',
          label: () => _t('selfService2.selectType.option3'),
          preImgs: [emailImg],
          formatedTypes: [['my_email']],
          blockId: 'ChooseSecurityVerfication11',
        },
      ],
    },
  ],
  //仅绑定手机+交易密码
  [
    [['self_question'], ['my_sms', 'withdraw_password']],
    {
      blockId: 'ChooseSecurityVerfication3',
      options: [
        {
          key: 'my_sms+withdraw_password',
          label: () => _t('selfService2.selectType.option4'),
          preImgs: [phoneImg, plusImg, passwordImg],
          formatedTypes: [['my_sms', 'withdraw_password']],
          blockId: 'ChooseSecurityVerfication31',
        },
        {
          key: 'self_question',
          label: () => _t('selfService2.selectType.option2'),
          preImgs: [noPhoneImg],
          formatedTypes: [['self_question']],
          blockId: 'ChoosecurityVerfication32',
        },
      ],
    },
  ],
  // 手机+邮箱+交易密码
  [
    [
      ['my_sms', 'withdraw_password'],
      ['my_email', 'withdraw_password'],
    ],
    {
      blockId: 'ChooseSecurityVerfication4',
      options: [
        {
          key: 'my_sms+withdraw_password',
          label: () => _t('selfService2.selectType.option4'),
          preImgs: [phoneImg, plusImg, passwordImg],
          formatedTypes: [['my_sms', 'withdraw_password']],
          blockId: 'ChooseSecurityVerfication41',
        },
        {
          key: 'my_email+withdraw_password',
          label: () => _t('selfService2.selectType.option5'),
          preImgs: [emailImg, plusImg, passwordImg],
          formatedTypes: [['my_email', 'withdraw_password']],
          blockId: 'ChooseSecurityVerfication42',
        },
      ],
    },
  ],
]);

// 重置谷歌验证不同校验类型的埋点
export const BLOCKIDS = new Map([
  [[['my_email']], 'SecurityVerfication5'],
  // [[['my_sms']], 'SecurityVerfication6'],
  // [[['my_sms', 'withdraw_password']], 'SecurityVerfication7'],
  [[['my_email', 'withdraw_password']], 'SecurityVerfication8'],
]);
