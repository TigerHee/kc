/**
 * Owner: willen@kupotech.com
 */
import { Dialog, Form, styled, withTheme } from '@kux/mui';
import { injectLocale } from 'components/LoadLocale';
import SecForm from 'components/NewCommonSecurity';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';

const noop = () => {};

const { withForm } = Form;

const ModalTitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

@withTheme
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
    const { form, onCancel = noop } = this.props;
    onCancel();
    form.resetFields();
  };

  changeVerifyType = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  render() {
    const {
      form,
      theme,
      onInit,
      visible,
      verifyConfig = {},
      handleKey = '',
      modalTitle = '',
      modalLabelPre = '',
      customKeyValue = {},
      overFlow = true,
      submitBtnTxt = _t('submit'),
    } = this.props;
    const allowTypes = verifyConfig.verifyType || [];

    return (
      <Dialog
        title={<ModalTitle>{modalTitle || _t('security.verify')}</ModalTitle>}
        footer={null}
        open={visible}
        onCancel={this.handleCancel}
        cancelText={null}
        okText={null}
        style={{ maxWidth: 520, width: '100%', margin: 24, paddingBottom: '32px' }}
      >
        <div style={{ height: '6px' }} />
        <SecForm
          withPwd
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
