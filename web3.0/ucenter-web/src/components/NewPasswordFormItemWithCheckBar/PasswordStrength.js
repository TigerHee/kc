import { styled } from '@kux/mui';
import { _t } from 'tools/i18n';
import { PASSWORD_STRENGTH } from 'utils/validate';

// 密码强度等级对应文案
const PASSWORD_STRENGTH_TEXT = [
  _t('9b13f524515e4000a56c'),
  _t('a6cb9fec71714000a543'),
  _t('d35e56363b5f4000aecd'),
];
const PASSWORD_STRENGTH_COLOR = ['secondary', 'complementary', 'textPrimary'];

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
  margin-top: 8px;

  .password-strength-left {
    display: flex;
    flex-flow: nowrap row;
    align-items: center;
  }

  .password-strength-text {
    margin-right: 6px;
    color: ${(props) => props.theme.colors[PASSWORD_STRENGTH_COLOR[props.strengthLevel]]};
    font-weight: 500;
    font-size: 14px;
    font-family: 'PingFang SC';
    font-style: normal;
    line-height: 130%;
    font-feature-settings: 'liga' off, 'clig' off;
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
    font-weight: 400;
    font-size: 13px;
    font-family: 'PingFang SC';
    font-style: normal;
    line-height: 130%;
    font-feature-settings: 'liga' off, 'clig' off;
  }
`;

export const PasswordStrength = ({ strengthLevel }) => {
  return (
    <Container strengthLevel={strengthLevel}>
      <div className="password-strength-left">
        <span className="password-strength-text">{PASSWORD_STRENGTH_TEXT[strengthLevel]}</span>
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
