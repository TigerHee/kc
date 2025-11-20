/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t, addLangToPath } from 'utils/lang';
import { Icon } from 'antd';
import { MAINSITE_HOST } from 'utils/siteConfig';
import style from './style.less';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    securtyStatus: state.user.securtyStatus,
    isInApp: state.app.isInApp,
  };
})
export default class TradePasswordCheck extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { isLogin, dispatch, isInApp } = this.props;
    if (!isLogin) {
      dispatch({
        type: 'user/update',
        payload: { showLoginDrawer: true },
      });
    } else {
      window.location.href = addLangToPath(`${MAINSITE_HOST}/account/security/protect`);
    }
  };

  render() {
    const { className, isLogin, securtyStatus, children } = this.props;
    const { WITHDRAW_PASSWORD } = securtyStatus || {};

    return (
      <React.Fragment>
        <div onClick={this.handleClick} className={className}>
          {children((
            <React.Fragment>
              <div className={style.name}>{_t('spotlight.tradepwd')}</div>
              {isLogin && (
                <React.Fragment>
                  {WITHDRAW_PASSWORD ? (
                    <div className={style.greentip} key="withdraw-green">
                      <Icon type="check-circle" theme="filled" />{_t('spotlight.set')}
                    </div>
                  ) : (
                    <div className={style.redtip} key="withdraw-red">
                      <Icon type="close-circle" theme="filled" />{_t('spotlight.setno')}
                    </div>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
