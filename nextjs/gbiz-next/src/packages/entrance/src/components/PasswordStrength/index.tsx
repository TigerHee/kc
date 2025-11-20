import React from 'react';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';
import clsx from 'clsx';

// 密码强度对输入密码长度分水岭
const PASSWORD_STRENGTH_LELNGTH = 12;
// 密码强度等级对应值
const PASSWORD_STRENGTH = {
  low: 0,
  middle: 1,
  high: 2,
};
// 密码强度等级对应文案
const PASSWORD_STRENGTH_TEXT = (_t) => [
  _t('9b13f524515e4000a56c'),
  _t('a6cb9fec71714000a543'),
  _t('d35e56363b5f4000aecd'),
];
const PASSWORD_STRENGTH_COLOR = ['var(--kux-secondary)', 'var(--kux-complementary)', 'var(--kux-textPrimary)'];
// 是否包含特殊字符
const containsSpecialChars = (str) => {
  const specialCharsReg = /[!@#$%^&*_+={}\\[\]\\|\\:;"'<>,\\.\\?\\/~`-]/g;
  return specialCharsReg.test(str);
};

// 获取密码强度
const getStrengthLevel = (pwd) => {
  // 没有输入密码，兜底强度是低
  if (!pwd) {
    return PASSWORD_STRENGTH.low;
  }
  const len = pwd.length;
  const hasSpecialChars = containsSpecialChars(pwd);
  if (!hasSpecialChars) {
    // 没有特殊字符，大于12强度为中等，小于12强度为低
    return len > PASSWORD_STRENGTH_LELNGTH ? PASSWORD_STRENGTH.middle : PASSWORD_STRENGTH.low;
  }
  // 有特殊字符，大于12强度为高，小于12强度为中等
  return len > PASSWORD_STRENGTH_LELNGTH ? PASSWORD_STRENGTH.high : PASSWORD_STRENGTH.middle;
};

const PasswordStrength = ({ password }) => {
  const strengthLevel = getStrengthLevel(password);
  const { t: _t } = useTranslation('entrance');
  return (
    <div className={styles.container} data-inspector="password_strength">
      <div className={clsx(styles.passwordStrengthLeft)}>
        <span className={clsx(styles.passwordStrengthText, styles[`strengthLevel${strengthLevel}`])}>{PASSWORD_STRENGTH_TEXT(_t)[strengthLevel]}</span>
        <div className={styles.passwordStrengthLevel}>
          {/* 如果密码等级大于 low，第一个元素添加背景 */}
          <div className={clsx(styles.strengthLevelItem, strengthLevel >= PASSWORD_STRENGTH.low ? styles[`strengthLevel${strengthLevel}`] : null)} />
          {/* 如果密码等级大于 middle */}
          <div className={clsx(styles.strengthLevelItem, strengthLevel >= PASSWORD_STRENGTH.middle ? styles[`strengthLevel${strengthLevel}`] : null)} />
          {/* 如果密码等级大于 high */}
          <div className={clsx(styles.strengthLevelItem, strengthLevel >= PASSWORD_STRENGTH.high ? styles[`strengthLevel${strengthLevel}`] : null)} />
        </div>
      </div>
      <span className={clsx(styles.passwordStrengthDesc, strengthLevel === PASSWORD_STRENGTH.high && styles.hide)}>{_t('66f03b84f57e4000aebc')}</span>
    </div>
  );
};

export default PasswordStrength;
