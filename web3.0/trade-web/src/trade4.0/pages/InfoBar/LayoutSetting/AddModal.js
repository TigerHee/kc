/*
  * owner: borden@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'dva';
import Dialog from '@mui/Dialog';
import Form from '@mui/Form';
import Input from '@mui/Input';
import Radio from '@mui/Radio';
import { DEFAULT_LAYOUTS } from '@/layouts/XlLayout/layout';
import { _t } from 'src/utils/lang';

const { FormItem, useForm } = Form;

const options = [
  { label: _t('uvKy9BRr8VhX5Ymh5GyRBd'), value: 'current' },
  ...DEFAULT_LAYOUTS.map(v => ({
    value: v.code,
    label: v.name(),
  })),
];
const AddModal = React.memo(({ open, onCancel, onOk, ...otherProps }) => {
  const [form] = useForm();
  const confirmLoading = useSelector(
    (state) => state.loading.effects['setting/addLayout'],
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
  }, [form, onOk, onCancel]);

  return (
    <Dialog
      open={open}
      size="medium"
      onOk={handleOk}
      onCancel={onCancel}
      cancelText={_t('cancel')}
      title={_t('gMTQ5ip8up5FTKwn8zkTgK')}
      okText={_t('dfDwCKHqVQciWBdsF4gJ8J')}
      okButtonProps={{ loading: confirmLoading }}
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
        <div className="kux-trade4-global-label">{_t('hW7ppBPWkCJaY6GnyLwPf9')}</div>
        <FormItem name="template" initialValue={options[0].value}>
          <Radio.Group options={options} />
        </FormItem>
      </Form>
    </Dialog>
  );
});

export default AddModal;
