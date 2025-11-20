import { _t } from 'tools/i18n';
import institutionIcon from 'static/account/kyc/delete.svg';
import personalIcon from 'static/account/personal.svg';

// 认证类型
export const TYPE = {
  noCommit: -1, // 未提交
  personal: 0, // 个人认证
  institution: 1, // 机构认证
};

// 页面类型
export const PAGE_TYPE = {
  // 个人认证
  personal: {
    type: 0,
    code: 'personal',
    icon: institutionIcon,
    title: () => _t('kyc.certification.personal'),
    description: () => _t('3d3eec1940a34000a89c'),
    triggerBtnText: () => _t('kyc.certification.mechanism.change'),
  },
  // 机构认证
  institution: {
    type: 1,
    code: 'institution',
    icon: personalIcon,
    title: () => _t('kyc.certification.mechanism'),
    description: () => _t('b8872579477f4000ad30'),
    triggerBtnText: () => _t('kyc.certification.personal.change'),
  },
};
