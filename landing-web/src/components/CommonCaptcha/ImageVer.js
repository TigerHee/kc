/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { Input, Button, Modal } from 'antd';
import style from './style.less';
import SvgIcon from 'components/common/KCSvgIcon';
import { connect } from 'react-redux';
import { withLocale } from 'components/Locale';

@withLocale()
@connect((state) => {
  const { challenge = '', imageTimestamp, imageVerVisible, imageSrc } = state.captcha;
  return {
    challenge,
    imageTimestamp,
    imageVerVisible,
    imageSrc,
  };
})
export default class ImageVer extends React.PureComponent {
  state = {
    codeValue: '',
  };

  // static getDerivedStateFromProps(nextProps, preState) {
  //   if (!nextProps.imageVerSuccess !== preState.modalVisible) {
  //     return {
  //       ...preState,
  //       modalVisible: !nextProps.imageVerSuccess,
  //     };
  //   }
  //   return null;
  // }

  refreshCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'captcha/getImage',
    });
  };

  handleInputChange = (e) => {
    const value = e.target.value;
    this.setState({
      codeValue: value,
    });
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'captcha/update',
      payload: {
        imageVerVisible: false,
      },
    });
  };

  render() {
    const { _t } = this.props;
    return (
      <Modal
        width={354}
        title={_t('verify.img.title')}
        visible={this.props.imageVerVisible}
        footer={null}
        wrapClassName={style.imageVerModal}
        afterClose={() => {
          this.setState({ codeValue: '' });
        }}
        onCancel={this.handleCancel}
      >
        <Input
          value={this.state.codeValue}
          onChange={this.handleInputChange}
          placeholder={_t('verify.img.tip')}
        />
        <div className={style.imgWrapper}>
          <img
            className={style.verImage}
            src={this.props.imageSrc}
            alt="verify"
          />
          <SvgIcon onClick={this.refreshCode} iconId="refresh" className={style.refreshIcon} />
        </div>
        <Button
          className={style.confirmButton}
          type="primary"
          onClick={() => this.props.onSuccess(this.state.codeValue)}
        >
          {_t('confirm')}
        </Button>
      </Modal>
    );
  }
}
