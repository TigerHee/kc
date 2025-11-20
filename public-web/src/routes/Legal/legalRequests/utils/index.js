/**
 * Owner: odan.ou@kupotech.com
 */
import { _t as _tOrigin, _tHTML as _tHTMLOrigin } from 'tools/i18n';
import { IS_TEST_ENV, _DEV_ } from '../../../../utils//env';
export * from './theme';

const handleI18n = (fn, key, text, variables) => {
  // 如果不传递text，且第三个值不存在，则第二个值最为变量
  if (typeof text !== 'string' && !variables) {
    variables = text;
    text = undefined;
  }
  const val = fn(key, variables);
  if (text && (_DEV_ || (IS_TEST_ENV && sessionStorage?.getItem('_i18n_local_lang')))) {
    return val === key ? text : val;
  }
  return val;
};

export const _t = (key, text, variables) => {
  return handleI18n(_tOrigin, key, text, variables);
};

export const _tHTML = (key, text, variables) => {
  return handleI18n(_tHTMLOrigin, key, text, variables);
};

/**
 * 一些配置参数
 */
export const LegalConf = {
  LeftPadding: '240px',
};

/**
 * 是否单选
 */
export const yesOrNoRadio = [
  {
    label: _t('4NcjP32Lpd24NqqqozeVcL', '是'), // '是',
    value: 1,
  },
  {
    label: _t('b7Dra2Zkbyg9bHgLrzjbb7', '否'), // '否',
    value: 0,
  },
];

export const LegalOtherTypeKey = '其他/Others';

/**
 * 案由类型
 */
export const legalTypes = [
  {
    label: _t('1cbd74e10e0c4000a759'),
    value: '刑事-洗钱/Criminal-Money Laundering',
  },
  {
    label: _t('e47bf449c1cb4000a3d8'),
    value: '刑事-国家安全和恐怖主义相关/Criminal-National Security and Terrorism',
  },
  {
    label: _t('ce7ee25ffb684000aa50'),
    value: '刑事-毒品相关/Criminal-Drug-related',
  },
  {
    label: _t('dd4ec63c08634000ad48'),
    value: '刑事-腐败类/Criminal-Corruption',
  },
  {
    label: _t('fd97ff0ed5cb4000a4f9'),
    value: '刑事-欺诈/经济诈骗/Criminal-Fraud/Economic Dishonesty',
  },
  {
    label: _t('740e019bf3d74000a490'),
    value: '刑事-加密货币盗窃类/Criminal-Cryptocurrency Theft',
  },
  {
    label: _t('3c38e0efb8284000a492'),
    value: '刑事-开设赌场/赌博/Criminal-Operating Casinos/Gambling',
  },
  {
    label: _t('4b6950740a6a4000a012'),
    value: '刑事-黑客攻击/计算机入侵/Criminal-Hacking/Computer Intrusion',
  },
  {
    label: _t('bb4a927b80ef4000a24e'),
    value: '刑事-勒索软件/钓鱼软件/Criminal-Ransomware/Phishing Software',
  },
  {
    label: _t('3cc7211a50de4000a9e2'),
    value: '刑事-偷盗、贩卖个人信息/Criminal-Theft and Sale of Personal Information',
  },
  {
    label: _t('bfad143ee5134000ad6e'),
    value: '刑事-贩卖妇女儿童/Criminal-Trafficking in Women and Children',
  },
  {
    label: _t('80222b0202664000a63e'),
    value: '刑事-非法集资/Criminal-Illegal Fundraising',
  },
  {
    label: _t('19b257ba3b444000af5b'),
    value: '民事-商业纠纷/Civil-Commercial Dispute',
  },
  {
    label: _t('2580035a55d84000a5c0'),
    value: '民事-破产类/Civil-Bankruptcy',
  },
  {
    label: _t('daccf7d1104b4000a8c4'),
    value: '行政相关/Administrative-related',
  },
  {
    label: _t('identity.other', '其他'), // '其他',
    value: LegalOtherTypeKey,
  },
];

/**
 * 请求类型
 */
export const requestsTypes = [
  {
    label: _t('5dDirjBfX3iUjpZF7vQwY8', '披露信息'), // '披露信息',
    value: 'announce',
  },
  {
    label: _t('3CXXG2KyrA2qEE2sec33vu', '划转资产'), // '划转资产',
    value: 'transfer',
  },
];
/**
 * 禁用的备注值
 */
export const banRemarkList = ['其他', '其他原因', 'other', 'others'];

/**
 * 承诺
 */
export const userCommitmentList = [
  {
    label: _t(
      'ucfRv5nqVoHz76Le64gJRt',
      '我承诺我是被授权的执法人员或政府雇员，正在进行一项调查，这是一个官方请求',
    ), // '我承诺我是被授权的执法人员或政府雇员，正在进行一项调查，这是一个官方请求',
    value: true,
  },
];

/**
 * 必填规则
 */
export const RequiredRules = [
  { required: true, message: _t('kM2apKkoR5Gw6wAaBcQCTX') },
  {
    validator(rule, value) {
      if (String(value).trim() === '') {
        return Promise.reject();
      }
      return Promise.resolve();
    },
    message: _t('kM2apKkoR5Gw6wAaBcQCTX'),
  },
];

/**
 * 文件上传规则
 */
export const FileRules = [
  {
    validator(rule, value) {
      if (Array.isArray(value)) {
        const hasLoading = value.some((item) => item?.status === 'uploading');
        if (hasLoading) {
          return Promise.reject(_t('3rrHNcznrizmw22rvjMiPv', '上传中'));
        }
        if (value.filter((item) => !!item.response).length) {
          return Promise.resolve();
        }
      }
      return Promise.reject(_t('kM2apKkoR5Gw6wAaBcQCTX', '必填'));
    },
  },
];

/**
 * 处理文件上传时的数据问题
 * @param {Record<string, any>} values
 * @param {string[] | string} keys
 */
export const fileParamsHandle = (values, keys) => {
  const usedKeys = Array.isArray(keys) ? keys : [keys];
  const res = { ...values };
  usedKeys.forEach((key) => {
    res[key] = res[key]?.map((item) => item?.response?.fileId)?.filter((item) => !!item);
  });
  return res;
};

/**
 * 判断是否为空值
 * @param {unknown} val
 */
export const valIsEmpty = (val) => val == null || String(val).trim() === '';
