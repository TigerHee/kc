/**
 * Owner: willen@kupotech.com
 */
import React from 'react';

export default class SubAccountModalBase extends React.Component {
  requiredFields = undefined;

  checkIfCanSubmit = () => {
    const { visible, loading } = this.props;
    if (!visible || loading) {
      return false;
    }
    const values = Object.values(this.props.form.getFieldsValue(this.requiredFields));
    return values.some((v) => !v && v !== 0);
  };

  handleOk = (e) => {
    e && e.preventDefault && e.preventDefault();
    const { form, handleOk = () => {}, modalName } = this.props;
    form.validateFields().then((values) => {
      handleOk(values, modalName);
    });
  };
}
