/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'components/common/KCSvgIcon';
import { Form, Spin, Modal } from '@kc/ui';
// import SecForm from 'components/CommonSecurity';
// import CoinPrecision from 'components/common/CoinPrecision';
// import { Link } from 'components/Router';
import { _t } from 'tools/i18n';
// import { multiply, dropZero } from 'helper';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@connect((state) => {
  return {
    bizType: state.distribute.bizType,
    success: state.distribute.success,
    // ordering: state.loading.effects['spotlight/order'],
    ordering: state.loading.effects['spotlight/orderAndVerify'],
  };
})
@Form.create()
@injectLocale
export default class ModalContent extends React.Component {
  static propTypes = {
    rule: PropTypes.object,
    // buyNum: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // visible: PropTypes.bool,
    // handleCloseBuyModal: PropTypes.func,
  };

  static defaultProps = {
    status: 0,
  };

  handleCloseModal = () => {
    this.props.handleCloseModal();
  };

  renderContent = () => {
    const { status, msg } = this.props;
    // const { success } = this.state;

    if (status === 1) {
      return (
        <div className={style.loading} style={{ height: '254px' }}>
          <Spin spot />
          <div className={`mt-18 ${style.subtip}`}>{_t('spotlight.ordering')}</div>
        </div>
      );
    }
    if (status === 2) {
      return (
        <div className={style.loading} style={{ height: '145px' }}>
          <div
            className={`mt-18 ${style.subtip}`}
            style={{ textAlign: 'left', fontSize: '16px', display: 'flex', lineHeight: '16px' }}
          >
            <SvgIcon
              iconId="sec-checked-fill"
              style={{ height: '20px', width: '20px', marginRight: '6px' }}
            />
            {_t('spotlight.order.success')}
          </div>
          {/* <div className={`mt-14 ${style.tips}`}>
            {_t('spotlight.order.success.tip', {
              limit: 2,
              currency: (quoteCurrency || 'KCS'),
            })}
          </div> */}
          <div className={`mt-14 ${style.tips}`}>{_t('spotlight.buy.success.tip')}</div>
        </div>
      );
    }
    if (status === 3) {
      return (
        <div className={style.tipsContent} style={{ height: '95px' }}>
          <div
            className={`mt-18 ${style.subtip}`}
            style={{ textAlign: 'left', fontSize: '16px', display: 'flex', lineHeight: '16px' }}
          >
            <SvgIcon
              iconId="error2"
              style={{ color: '#c2c6cd', height: '20px', width: '20px', marginRight: '6px' }}
            />
            {msg.length ? msg : _t('spotlight.order.failed')}
          </div>
        </div>
      );
    }

    return null;
  };

  render() {
    // const { ordering, visible, handleCloseBuyModal } = this.props;
    const { visible } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        width={406}
        visible={visible}
        // visible={visible}
        // onCancel={handleCloseBuyModal}
        onCancel={this.handleCloseModal}
        footer={null}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}
