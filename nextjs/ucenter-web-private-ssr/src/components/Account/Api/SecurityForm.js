/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { styled } from '@kux/mui';
import classnames from 'clsx';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import GoogleForm from './GoogleForm';
import SimpleForm from './SimpleForm';
import SMSForm from './SMSForm';

const Security = styled.div`
  .security_tabs {
    display: flex;
    margin-bottom: 41px;
    color: ${(props) => props.theme.colors.text60};
    font-size: 16px;
    line-height: 24px;
    text-align: center;

    span {
      cursor: pointer;

      &.active {
        color: ${(props) => props.theme.colors.primary};
      }

      & + span {
        position: relative;
        margin-left: 25px;

        &::after {
          position: absolute;
          top: 4px;
          left: -12px;
          display: block;
          width: 1px;
          height: 16px;
          background: ${(props) => props.theme.colors.cover8};
          content: '';
        }
      }
    }
  }
`;

const SecurityForm = ({ verifyType, className, onOk, bizType, okText }) => {
  useLocale();
  const _verifyType = verifyType || [];
  const allTypes = _verifyType.flat();
  const verifyEmail = allTypes.indexOf('my_email') !== -1;
  const verifyGoogle = allTypes.indexOf('google_2fa') !== -1;
  const verifyWithdraw = allTypes.indexOf('withdraw_password') !== -1;
  const verifySMS = allTypes.indexOf('my_sms') !== -1;

  const GOOGLE_MODE = verifyGoogle && verifyWithdraw;
  const SMS_MODE = verifySMS && verifyWithdraw;
  const SIMPLE_MODE = !GOOGLE_MODE && !SMS_MODE && verifyWithdraw;

  const simpleGoogleMode = !verifyEmail;

  // 计算当前展示模式
  const calcCurMode = () => {
    if (GOOGLE_MODE) return 'GOOGLE_MODE';
    if (SMS_MODE) return 'SMS_MODE';
    if (SIMPLE_MODE) return 'SIMPLE_MODE';
  };

  // 取值 'GOOGLE_MODE','SMS_MODE','SIMPLE_MODE'
  const [currentMode, setCurrentMode] = useState(calcCurMode());

  // 切换模式
  const toggleCurMode = (mode) => {
    setCurrentMode(mode);
  };

  useEffect(() => {
    setCurrentMode(calcCurMode());
  }, [verifyType]);

  return (
    <Security className={className}>
      <div>
        <div className={classnames({ security_tabs: GOOGLE_MODE || SMS_MODE })}>
          {GOOGLE_MODE ? (
            <span
              className={classnames({ active: currentMode === 'GOOGLE_MODE' })}
              onClick={() => {
                toggleCurMode('GOOGLE_MODE');
              }}
            >
              {simpleGoogleMode ? _t('validation.g2fa') : _t('security.g2faAndEmail')}
            </span>
          ) : null}
          {SMS_MODE ? (
            <span
              className={classnames({ active: currentMode === 'SMS_MODE' })}
              onClick={() => {
                toggleCurMode('SMS_MODE');
              }}
            >
              {_t('validation.sms')}
            </span>
          ) : null}
        </div>

        {currentMode === 'GOOGLE_MODE' ? (
          <GoogleForm onOk={onOk} bizType={bizType} simple={simpleGoogleMode} okText={okText} />
        ) : null}

        {currentMode === 'SMS_MODE' ? (
          <SMSForm onOk={onOk} bizType={bizType} okText={okText} />
        ) : null}
      </div>

      {SIMPLE_MODE ? <SimpleForm onOk={onOk} bizType={bizType} okText={okText} /> : null}
    </Security>
  );
};

export default connect()(SecurityForm);
