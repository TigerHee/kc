/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import clxs from 'classnames';
import { useTheme } from '@kufox/mui';
import { Link } from 'components/Router';
import { StatusOutlined, SuccessOutlined } from '@kufox/icons';
import { useLocale } from '@kucoin-base/i18n';
import style from './style.less';

const IconSize = 20;

const WarningColor = '#DB5E5E';
const SuccessColor = '#2DBD96';

const SecuritySetting = ({
  security,
  tip,
  isSub = false,
  needTwiceProtect = true,
  needEmail = false,
}) => {
  useLocale();
  const theme = useTheme();
  const { currentTheme } = theme;
  let isTwiceProtect = security.GOOGLE2FA || security.SMS;
  let message1 = 'active.sms.g2fa.verify';
  let link1 = '/account/security/g2fa';
  if (isSub) {
    isTwiceProtect = security.GOOGLE2FA && (security.SMS || security.EMAIL);
    message1 = 'sub.active.verify';
    link1 = '/account/security';
  }
  const isWithDrawProtect = security.WITHDRAW_PASSWORD;
  const isEmail = security.EMAIL;
  const darkTheme = currentTheme === 'dark';
  return (
    <div className={style.security}>
      <div className={clxs(style.content, { [style.contentInDark]: darkTheme })}>
        <h1>{tip}</h1>
        <div className={style.alertContainer}>
          {needTwiceProtect && (
            <div className={clxs(style.alertItem, { [style.alertItemInDark]: darkTheme })}>
              {isTwiceProtect ? (
                <SuccessOutlined className="mr-8" size={IconSize} color={SuccessColor} />
              ) : (
                <StatusOutlined className="mr-8" size={IconSize} color={WarningColor} />
              )}
              {_t(message1)}
              {isTwiceProtect ? null : <Link to={link1}>{_t('go.setting')}</Link>}
            </div>
          )}
          <div className={clxs(style.alertItem, { [style.alertItemInDark]: darkTheme })}>
            <div className={style.statusIcon}>
              {isWithDrawProtect ? (
                <SuccessOutlined size={IconSize} color={SuccessColor} />
              ) : (
                <StatusOutlined size={IconSize} color={WarningColor} />
              )}
            </div>
            {_t('set.trade.code')}
            {isWithDrawProtect ? null : (
              <Link to="/account/security/protect">{_t('go.setting')}</Link>
            )}
          </div>
          {needEmail && !isSub ? (
            <div className={clxs(style.alertItem, { [style.alertItemInDark]: darkTheme })}>
              <div className={style.statusIcon}>
                {isEmail ? (
                  <SuccessOutlined size={IconSize} color={SuccessColor} />
                ) : (
                  <StatusOutlined size={IconSize} color={WarningColor} />
                )}
              </div>
              {isEmail ? _t('api.manage.bind.already') : _t('api.manage.bind')}
              {isEmail ? null : (
                <Link to="/account/security/email">{_t('api.manage.bind.to')}</Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default connect((state) => {
  const { isSub = false } = state.user.user || {};
  return {
    security: state.user.securtyStatus,
    isSub,
  };
})(SecuritySetting);
