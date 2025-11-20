import React from 'react';
import { styled } from '@kux/mui';
import { useTranslation } from '@tools/i18n';

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
const PASSWORD_STRENGTH_COLOR = ['secondary', 'complementary', 'textPrimary'];
// 是否包含特殊字符
const containsSpecialChars = (str) => {
  const specialCharsReg = /[!@#$%^&*_+={}\\[\]\\|\\:;"'<>,\\.\\?\\/~`-]/g;
  return specialCharsReg.test(str);
};

const StrengthLevelItem = styled('div')`
  width: 14px;
  height: 3px;
  border-radius: 1.4px;
  background-color: ${(props) => props.theme.colors[props.bgColor ?? 'cover16']};
  margin-right: 4px;
`;

const Container = styled('div')`
  display: flex;
  flex-flow: wrap row;
  align-items: center;
  margin-top: -14px;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: -22px;
  }

  .password-strength-left {
    display: flex;
    flex-flow: nowrap row;
    align-items: center;
  }

  .password-strength-text {
    color: ${(props) => props.theme.colors[PASSWORD_STRENGTH_COLOR[props.strengthLevel]]};
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    margin-right: 6px;
  }

  .password-strength-level {
    display: flex;
    flex-flow: nowrap row;
    align-items: center;
    justify-content: flex-start;
    margin-right: 12px;

    div:last-child {
      margin-right: 0;
    }
  }

  .password-strength-desc {
    display: ${(props) => (props.strengthLevel === PASSWORD_STRENGTH.high ? 'none' : 'inline')};
    color: ${(props) => props.theme.colors.text40};
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: 'PingFang SC';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; /* 16.9px */
  }
`;

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
    <Container data-inspector="password_strength" strengthLevel={strengthLevel}>
      <div className="password-strength-left">
        <span className="password-strength-text">{PASSWORD_STRENGTH_TEXT(_t)[strengthLevel]}</span>
        <div className="password-strength-level">
          {/* 如果密码等级大于 low，第一个元素添加背景 */}
          <StrengthLevelItem
            bgColor={
              strengthLevel >= PASSWORD_STRENGTH.low ? PASSWORD_STRENGTH_COLOR[strengthLevel] : null
            }
          />
          {/* 如果密码等级大于 middle */}
          <StrengthLevelItem
            bgColor={
              strengthLevel >= PASSWORD_STRENGTH.middle
                ? PASSWORD_STRENGTH_COLOR[strengthLevel]
                : null
            }
          />
          {/* 如果密码等级大于 high */}
          <StrengthLevelItem
            bgColor={
              strengthLevel >= PASSWORD_STRENGTH.high
                ? PASSWORD_STRENGTH_COLOR[strengthLevel]
                : null
            }
          />
        </div>
      </div>
      <span className="password-strength-desc">{_t('66f03b84f57e4000aebc')}</span>
    </Container>
  );
};

export default PasswordStrength;
