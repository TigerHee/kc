/**
 * Owner: willen@kupotech.com
 */
import ModalSecForm from 'components/Account/ModalSecurity';
import React from 'react';

class ModalSecurity extends React.Component {
  render() {
    const {
      visible,
      verifyType = [],
      bizType,
      onCancel,
      callback,
      modalTitle = '',
      modalLabelPre = '',
      customKeyValue = {},
      submitBtnTxt,
    } = this.props;

    return (
      <ModalSecForm
        visible={visible}
        onCancel={onCancel}
        handleResult={callback}
        verifyConfig={{
          verifyType,
          bizType,
        }}
        modalTitle={modalTitle}
        modalLabelPre={modalLabelPre}
        customKeyValue={customKeyValue}
        submitBtnTxt={submitBtnTxt}
      />
    );
  }
}

export default ModalSecurity;
