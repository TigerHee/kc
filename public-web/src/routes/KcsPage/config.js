/**
 * Owner: chris@kupotech.com
 */
import { keyBy } from 'lodash';

import { _t } from 'src/tools/i18n';
import K1Bag from 'static/kcs-intro/k1_bag.svg';
import K2Bag from 'static/kcs-intro/k2_bag.svg';
import K3Bag from 'static/kcs-intro/k3_bag.svg';
import K3Star from 'static/kcs-intro/k3_star.png';
import K4Bag from 'static/kcs-intro/k4_bag.svg';
import K4Star from 'static/kcs-intro/k4_star.png';

/**
 * titleColor 导航者
 * textColor K1 K2 K3
 * hintColor 按钮文字颜色
 * bgColor 按钮背景色
 * headerBg header 背景色
 * scopeColor 背景条纹颜色
 * borderColor 边框颜色
 * upgradeColor 升级攻略颜色
 */
export const levelConfigMap = {
  1: {
    titleColor: '#B3FFE8',
    textColor: '#B3FFE8',
    hintColor: '#B3FFE8',
    bgColor: '#118372',
    headerBg: '#031211',
    scopeColor: '#297067',
    borderColor: '#1ABDB5',
    upgradeColor: '#00C288',
    tabColor: '#00C288',
    upgradeColor6: 'rgba(0, 194, 136, 0.06)',
    borderColor2: 'rgba(0, 194, 136, 0.40)',
    upgradeBgColor: 'rgba(1, 196, 196, 0.04)',
    upgradeTipBgColor: 'rgba(1, 196, 196, 0.04)',
    overlayColor: '#031211',
    hoverColor: '#00C288',
    shineColor: '#7AFFD7',
    offset: '40%',
    srcSource: 'kcs_k1_h5_web',
    h5srcSource: 'kcs_k1_h5_web',
    bagSource: K1Bag,
  },
  2: {
    titleColor: '#C0FFFF',
    textColor: '#C0FFFF',
    hintColor: '#B3FFE8',
    bgColor: '#076262',
    headerBg: '#021112',
    scopeColor: '#076262',
    borderColor: '#01C4C4',
    upgradeColor: '#00C288',
    tabColor: '#01C4C4',
    upgradeColor6: 'rgba(1, 196, 196, 0.06)',
    borderColor2: 'rgba(1, 196, 196, 0.40)',
    upgradeBgColor: 'rgba(1, 196, 196, 0.04)',
    upgradeTipBgColor: 'rgba(1, 196, 196, 0.04)',
    overlayColor: '#021112',
    hoverColor: '#01C4C4',
    shineColor: '#00E6E6',
    offset: '25%',
    srcSource: 'kcs_k2_h5_web',
    h5srcSource: 'kcs_k2_h5_web',
    bagSource: K2Bag,
  },
  3: {
    titleColor: '#9FABFF',
    textColor: '#9FABFF',
    hintColor: '#D0D5FF',
    bgColor: '#3A47A2',
    headerBg: '#0D1027',
    scopeColor: '#596BE9',
    borderColor: '#5580FF',
    upgradeColor: '#5585FF',
    tabColor: '#5585FF',
    upgradeColor6: 'rgba(85, 133, 255, 0.06)',
    borderColor2: 'rgba(85, 133, 255, 0.40)',
    upgradeBgColor: 'rgba(191, 112, 255, 0.04)',
    upgradeTipBgColor: 'rgba(85, 133, 255, 0.04)',
    overlayColor: '#0D0E12',
    hoverColor: '#9FABFF',
    shineColor: '#A0BBFF',
    offset: '7.6vw',
    srcSource: 'kcs_k3_h5_web',
    h5srcSource: 'kcs_k3_h5_web',
    bagSource: K3Bag,
    starSource: K3Star,
  },
  4: {
    titleColor: '#FFE0B2',
    textColor: '#F6D3B5',
    hintColor: '#1D1D1D',
    bgColor: '#D1A054',
    headerBg: '#010101',
    scopeColor: '#F2AA3E',
    borderColor: '#CBA366',
    upgradeColor: '#CBA366',
    tabColor: '#CBA366',
    upgradeColor6: 'rgba(203, 163, 102, 0.06)',
    borderColor2: 'rgba(203, 163, 102, 0.4)',
    upgradeBgColor: 'rgba(203, 163, 102, 0.04)',
    upgradeTipBgColor: 'rgba(203, 163, 102, 0.04)',
    overlayColor: '#010101',
    hoverColor: '#CBA366',
    shineColor: '#FFFFFF',
    offset: '7.6vw',
    srcSource: 'kcs_k4_web',
    h5srcSource: 'kcs_k4_h5',
    bagSource: K4Bag,
    starSource: K4Star,
  },
};

// 权益等级
export const levels = [
  {
    level: 1,
    text: _t('dbe09ffe59e54000ab44'),
    maxPercent: 1,
    minAmount: 1,
    // maxAmount: 5000,
  },
  {
    level: 2,
    text: _t('cf50b99193034000af7c'),
    maxPercent: 5,
    minPercent: 1,
    minAmount: 1,
    // maxAmount: 5000,
  },
  {
    level: 3,
    text: _t('1123c4bf2db14000aa0f'),
    maxPercent: 10,
    minPercent: 5,
    minAmount: 1,
    // maxAmount: 5000,
  },
  {
    level: 4,
    text: _t('c0b380143bc04000a828'),
    minPercent: 10,
    minAmount: 1,
  },
];

export const totalLevel = levels.length;

// 权益等级 map映射
export const levelsMap = keyBy(levels, 'level');

export const EVENT = 'KCS_EVENT';
