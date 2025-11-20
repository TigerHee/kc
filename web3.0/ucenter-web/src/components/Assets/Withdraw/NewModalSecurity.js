/**
 * Owner: willen@kupotech.com
 */
import { css, Dialog, Form } from '@kux/mui';
import { injectLocale } from 'components/LoadLocale';
import SecForm from 'components/NewCommonSecurity';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';

const msModal = css`
  // width: 400px!important;
  .KuxDialog-content {
    padding-bottom: 32px;
  }
`;

const fixScroll = css``;

const noop = () => {};

const { withForm } = Form;

@connect()
@withForm()
@injectLocale
class ModalSecurity extends React.Component {
  handleResult = (result) => {
    const { handleResult = noop, form, verifyConfig } = this.props;
    form.resetFields();
    handleResult(result, verifyConfig.bizType);
  };

  handleCancel = () => {
    const { onCancel = noop } = this.props;
    onCancel();
  };

  changeVerifyType = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('ssss');
      }, 1000);
    });
  };

  render() {
    const {
      form,
      onInit,
      visible,
      verifyConfig = {},
      handleKey = '',
      modalTitle = '',
      modalLabelPre = '',
      customKeyValue = {},
      overFlow = true,
      submitBtnTxt = _t('submit'),
      isUseV2 = false,
      withPwd = true,
    } = this.props;
    const allowTypes = verifyConfig.verifyType || [];
    return (
      <Dialog
        title={modalTitle || _t('security.verify')}
        footer={null}
        open={visible}
        onCancel={this.handleCancel}
        cancelText={null}
        okText={null}
        style={{ maxWidth: 420, width: '100%', paddingBottom: 24, margin: 0 }}
      >
        <div style={{ height: '6px' }} />
        <SecForm
          withPwd={withPwd}
          handleKey={handleKey}
          allowTypes={allowTypes}
          bizType={verifyConfig.bizType || ''}
          onSwitchType={this.changeVerifyType}
          form={form}
          callback={this.handleResult}
          onInit={onInit}
          autoSubmit
          modalLabelPre={modalLabelPre}
          customKeyValue={customKeyValue}
          submitBtnTxt={submitBtnTxt}
        />
      </Dialog>
    );
  }
}

export default ModalSecurity;
