/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t } from 'utils/lang';
import { sensors } from 'utils/sensors';
import { Icon } from 'antd';
import AgreeModal from '../../module/AgreeModal';
import style from './style.less';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    loading: state.loading.effects['spotlight5/signCountryAgreement'],
  };
})
export default class CountryCheck2 extends React.Component {
  static propTypes = {
    country_agreement: PropTypes.string,
    isSignedAgreement: PropTypes.bool,
    children: PropTypes.func.isRequired,
    rule: PropTypes.object,
  };

  static defaultProps = {
    country_agreement: '',
  };

  state = {
    modalVisible: false,
  };

  visitModal = () => {
    this.setState({
      modalVisible: true,
    });
    const { rule = {} } = this.props;
    sensors.trackClick(['country', '1'], { coin: rule.currency });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  agree = async () => {
    const { dispatch, isSignedAgreement } = this.props;
    if (!isSignedAgreement) {
      await dispatch({
        type: 'spotlight5/signCountryAgreement',
      });
      this.closeModal();
    }
  };

  render() {
    const { country_agreement, loading, isLogin, isSignedAgreement, children } = this.props;
    const { modalVisible } = this.state;
    return (
      <React.Fragment>
        <AgreeModal
          title={_t('spotlight.country.blacklisttip')}
          visible={modalVisible}
          loading={loading}
          agreement={country_agreement}
          hideAgreeButton={!isLogin || isSignedAgreement}
          onCancel={this.closeModal}
          onAgree={this.agree}
        />
        <div onClick={this.visitModal}>
          {children((
            <React.Fragment>
              <div className={style.name}>{_t('spotlight.country.blacklisttip')}</div>
              {isLogin && (
                <React.Fragment>
                  {isSignedAgreement ? (
                    <div className={style.greentip} key="agree-green">
                      <Icon type="check-circle" theme="filled" />{_t('spotlight.agreed')}
                    </div>
                  ) : (
                    <div className={style.redtip} key="agree-red">
                      <Icon type="close-circle" theme="filled" />{_t('spotlight.gotoagreed')}
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
