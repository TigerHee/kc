/*
  * owner: borden@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'dva';
import Dialog from '@mui/Dialog';
import Form from '@mui/Form';
import Input from '@mui/Input';
import { _t } from 'src/utils/lang';

const { FormItem, useForm } = Form;

const EditModal = React.memo(({ open, onCancel, onOk, ...otherProps }) => {
  const [form] = useForm();
  const confirmLoading = useSelector(
    (state) => state.loading.effects['setting/editLayout'],
  );

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  const handleOk = useCallback(() => {
    form.validateFields().then((values) => {
      if (onOk) onOk(values);
    });
  }, [form, onOk]);

  return (
    <Dialog
      open={open}
      size="medium"
      onOk={handleOk}
      onCancel={onCancel}
      okText={_t('confirm')}
      cancelText={_t('cancel')}
      title={_t('1uHn7w8KEitV2FTEU8rDwj')}
      onButtonProps={{ loading: confirmLoading }}
      {...otherProps}
    >
      <Form form={form}>
        <FormItem
          name="name"
          label={_t('2VxamfgNSm7x9KPMwVSpYt')}
          rules={[
            { required: true, message: _t('form.required') },
            { min: 2, message: _t('mFUiW9rHbvt6Th1aMZeUQy') },
            { max: 200, message: _t('mFUiW9rHbvt6Th1aMZeUQy') },
          ]}
        >
          <Input
            size="large"
            style={{ marginTop: 6 }}
            placeholder={_t('mFUiW9rHbvt6Th1aMZeUQy')}
          />
        </FormItem>
      </Form>
    </Dialog>
  );
});

export default EditModal;
