/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import Html from 'components/common/Html';
import { _t } from 'utils/lang';
import { Modal, Checkbox, Button } from 'antd';
import style from './style.less';

export default class AgreeModal extends React.Component {

  static propTypes = {
    agreement: PropTypes.string,
    title: PropTypes.string,
    visible: PropTypes.bool,
    loading: PropTypes.bool,
    hideAgreeButton: PropTypes.bool,
    onCancel: PropTypes.func,
    onAgree: PropTypes.func,
  };

  static defaultProps = {
    agreement: '',
    title: '',
    visible: false,
    loading: false,
    hideAgreeButton: true,
    onCancel: () => {},
    onAgree: () => {},
  };

  state = {
    checked: false,
  };

  checkChange = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  };

  render() {
    const { agreement, title, visible, onCancel, onAgree, hideAgreeButton, loading } = this.props;
    const { checked } = this.state;

    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={onCancel}
        width={700}
        footer={null}
        maskClosable={false}
      >
        <div>
          <div className={style.agreement}>
            <Html>{ agreement }</Html>
          </div>
          {!hideAgreeButton && (
            <React.Fragment>
              <div className="pt-12 pb-12 text-center">
                <Checkbox
                  checked={checked}
                  onChange={this.checkChange}
                  className={style.checkbox}
                >
                  {_t('spotlight.agreemodal.check')}
                </Checkbox>
              </div>
              <div className={style.button}>
                <Button
                  type="primary"
                  disabled={!checked}
                  loading={loading}
                  onClick={onAgree}
                >
                  {_t('spotlight.ok')}
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>
      </Modal>
    );
  }
}

