/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t } from 'utils/lang';
import { Icon } from 'antd';
import AgreeModal from '../../module/AgreeModal';
import style from './style.less';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    loading: state.loading.effects['spotlight/signAgreement'],
  };
})
export default class AgreeCheck extends React.Component {
  static propTypes = {
    agreement: PropTypes.string,
    isSignedAgreement: PropTypes.bool,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    agreement: '',
  };

  state = {
    modalVisible: false,
  };

  visitModal = () => {
    this.setState({
      modalVisible: true,
    });
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
        type: 'spotlight/signAgreement',
      });
      this.closeModal();
    }
  };

  render() {
    const { className, agreement, loading, isLogin, isSignedAgreement, children } = this.props;
    const { modalVisible } = this.state;
    return (
      <React.Fragment>
        <AgreeModal
          title={_t('spotlight.agreetitle')}
          visible={modalVisible}
          loading={loading}
          agreement={agreement}
          hideAgreeButton={!isLogin || isSignedAgreement}
          onCancel={this.closeModal}
          onAgree={this.agree}
        />
        <div onClick={this.visitModal} className={className}>
          {children((
            <React.Fragment>
              <div className={style.name}>{_t('spotlight.agreetip')}</div>
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
