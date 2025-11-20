/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Input, Button, Dialog } from '@kufox/mui';
import style from './style.less';
import SvgIcon from 'components/common/KCSvgIcon';
// import config from 'config';
import { connect } from 'react-redux';

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
    const { value } = e.target;
    this.setState({
      codeValue: value,
    });
  };

  handleCancel = () => {
    this.setState({ codeValue: '' });
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
      <Dialog
        width={354}
        title={_t('verify.img.title')}
        open={this.props.imageVerVisible}
        footer={null}
        rootProps={{ className: style.imageVerModal }}
        onCancel={this.handleCancel}
      >
        <Input
          value={this.state.codeValue}
          onChange={this.handleInputChange}
          placeholder={_t('verify.img.tip')}
        />
        <div className={style.imgWrapper}>
          <img alt="" className={style.verImage} src={this.props.imageSrc} />
          <SvgIcon onClick={this.refreshCode} iconId="refresh" className={style.refreshIcon} />
        </div>
        <Button
          className={style.confirmButton}
          type="primary"
          onClick={() => this.props.onSuccess(this.state.codeValue)}
        >
          {_t('confirm')}
        </Button>
      </Dialog>
    );
  }
}
