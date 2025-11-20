/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'utils/router';
import { _t } from 'tools/i18n';
import { Icon } from '@kc/ui';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
  };
})
@injectLocale
export default class KYCCheck extends React.Component {
  static propTypes = {
    isCompletedKyc: PropTypes.bool,
    children: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { isLogin } = this.props;
    if (!isLogin) {
      push(`/ucenter/signin?back=${encodeURIComponent(window.location.href)}`);
    } else {
      push('/account/kyc');
    }
  };

  render() {
    const { isLogin, isCompletedKyc, children } = this.props;
    return (
      <React.Fragment>
        <div onClick={this.handleClick}>
          {children(
            <React.Fragment>
              <div className={style.name}>{_t('spotlight.kyc.title')}</div>
              {isLogin && (
                <React.Fragment>
                  {isCompletedKyc ? (
                    <div className={style.greentip} key="kyc-green">
                      <Icon type="check-circle" theme="filled" />
                      {_t('spotlight.kyc.ok')}
                    </div>
                  ) : (
                    <div className={style.redtip} key="kyc-red">
                      <Icon type="close-circle" theme="filled" />
                      {_t('spotlight.kyc.no')}
                    </div>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>,
          )}
        </div>
      </React.Fragment>
    );
  }
}
