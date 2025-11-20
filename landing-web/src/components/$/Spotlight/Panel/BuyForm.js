/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'kc-svg-sprite';
import { Form, Spin, Modal } from 'antd';
import { _t } from 'utils/lang';
import style from './style.less';

@connect((state) => {
  return {
    bizType: state.spotlight.bizType,
    success: state.spotlight.success,
    // ordering: state.loading.effects['spotlight/order'],
    ordering: state.loading.effects['spotlight/orderAndVerify'],
  };
})
@Form.create()
export default class BuyForm extends React.Component {

  static propTypes = {
    rule: PropTypes.object,
    // buyNum: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // visible: PropTypes.bool,
    // handleCloseBuyModal: PropTypes.func,
  };

  static defaultProps = {
    rule: {},
    // buyNum: 1,
    // visible: false,
    // handleCloseBuyModal: () => {},
  };

  handleCloseModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'spotlight/update',
      payload: { success: null },
    });
  };

  // state = {
  //   success: null,
  // };

  // handleCallback = async (result) => {
  //   const { dispatch, rule: { currency }, buyNum } = this.props;
  //   if (result && result.code === '200') {
  //     const { success } = await dispatch({
  //       type: 'spotlight/order',
  //       payload: {
  //         currency,
  //         size: buyNum,
  //       },
  //     });
  //     this.setState({ success });
  //   } else
  //   if (result && result.msg) {
  //     dispatch({
  //       type: 'notice/feed',
  //       payload: {
  //         type: 'message.error',
  //         message: result.msg,
  //       },
  //     });
  //   }
  // };

  renderContent = () => {
    const { form, rule, buyNum, ordering, bizType, success, isNewSpotlight7 } = this.props;
    // const { success } = this.state;

    const {
      currency,
      quoteCurrency,
      totalAmount,
      campaignAmount,
      price,
      unitAmount,
      unitPrice,
    } = rule;

    if (ordering) {
      return (
        <div className={style.loading}>
          <Spin spot />
          <div className={`mt-18 ${style.subtip}`}>{_t('spotlight.ordering')}</div>
        </div>
      );
    } else
    if (success === true) {
      return (
        <div className={style.loading}>
          <SvgIcon iconId="sec-checked-fill" />
          <div className={`mt-18 ${style.subtip}`}>{_t('spotlight.order.success')}</div>
          <div className={`mt-14 ${style.graytip}`}>
            {
              isNewSpotlight7
              ? _t('spotlight.order.success.tip.new7', {
                currency: quoteCurrency,
                hour: 2,
                min: 30,
              })
              : _t('spotlight.order.success.tip', {
                currency: quoteCurrency,
                limit: 5,
              })
            }
          </div>
        </div>
      );
    } else
    if (success === false) {
      return (
        <div className={style.loading}>
          <SvgIcon iconId="sec-close-fill" />
          <div className={`mt-18 ${style.subtip}`}>{_t('spotlight.order.failed')}</div>
          <div className={`mt-14 ${style.graytip}`}>{_t('spotlight.order.failed.tip')}</div>
        </div>
      );
    }

    return null;
    // const _price = price || 0; // 单个价格
    // const _totalAmount = multiply(unitAmount || 0, buyNum); // 份数 * 每份数量
    // const total = multiply(unitPrice || 0, buyNum); // 份数 * 每份价格

    // return (
    //   <Form>
    //     <div className={style.buyInfo}>
    //       <div className={style.infoRow}>
    //         <div>{_t('spotlight.buyform.currency')}{ currency }</div>
    //         <div>{_t('spotlight.buyform.price')}<CoinPrecision value={_price} coin={quoteCurrency} /> { quoteCurrency }/{ currency }</div>
    //         <div>{_t('spotlight.buyform.amount')}{ dropZero(_totalAmount) }</div>
    //         <div>{_t('spotlight.buyform.total')}<CoinPrecision value={total} coin={quoteCurrency} /> { quoteCurrency }</div>
    //       </div>
    //     </div>
    //     <SecForm
    //       form={form}
    //       bizType={bizType}
    //       allowTypes={[['withdraw_password']]}
    //       callback={this.handleCallback}
    //       submitBtnTxt={_t('spotlight.buyform.confirm')}
    //     />
    //     <div className={style.forgetPWDTip}>
    //       <Link to="/account/security/forgetWP">
    //         {_t('trade.code.forget')}
    //       </Link>
    //     </div>
    //   </Form>
    // );
  }

  render() {
    // const { ordering, visible, handleCloseBuyModal } = this.props;
    const { ordering, visible, success } = this.props;
    // const { success } = this.state;
    let title = null;
    // if (success === null && !ordering) {
    //   title = _t('spotlight.buy.comfirm');
    // } else
    if (success === true) {
      title = _t('spotlight.buy.success');
    } else
    if (success === false) {
      title = _t('spotlight.buy.failed');
    }

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        closable={!ordering}
        title={title}
        width={350}
        visible={ordering || (success !== null)}
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
