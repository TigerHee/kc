/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t, addLangToPath } from 'utils/lang';
import { Icon } from 'antd';
import { MAINSITE_HOST } from 'utils/siteConfig';
import { sensors } from 'utils/sensors';
import style from './style.less';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
  };
})
export default class KYCCheck extends React.Component {
  static propTypes = {
    isCompletedKyc: PropTypes.bool,
    children: PropTypes.func.isRequired,
    rule: PropTypes.object,
  };

  handleClick = () => {
    const { isLogin, dispatch, rule = {} } = this.props;
    if (!isLogin) {
      dispatch({
        type: 'user/update',
        payload: { showLoginDrawer: true },
      });
    } else {
      window.location.href = addLangToPath(`${MAINSITE_HOST}/account/kyc`);
      sensors.trackClick(['kyc', '1'], { coin: rule.currency });
    }
  };

  render() {
    const { isLogin, isCompletedKyc, children } = this.props;
    return (
      <React.Fragment>
        <div onClick={this.handleClick}>
          {children((
            <React.Fragment>
              <div className={style.name}>{_t('spotlight.kyc.title')}</div>
              {isLogin && (
                <React.Fragment>
                  {isCompletedKyc ? (
                    <div className={style.greentip} key="kyc-green">
                      <Icon type="check-circle" theme="filled" />{_t('spotlight.kyc.ok')}
                    </div>
                  ) : (
                    <div className={style.redtip} key="kyc-red">
                      <Icon type="close-circle" theme="filled" />{_t('spotlight.kyc.no')}
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
