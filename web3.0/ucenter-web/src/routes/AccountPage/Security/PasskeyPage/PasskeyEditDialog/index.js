import { Form, Input, Modal, toast } from '@kux/design';
import { useEffect, useState } from 'react';
import { updatePasskeyApi } from 'services/ucenter/passkey';
import { _t } from 'src/tools/i18n';
import * as styles from './styles.module.scss';

const { FormItem } = Form;

export default function PasskeyEditDialog({ open, values, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then(async (res) => {
      const credentialNickname = res.credentialNickname.trim();
      if (credentialNickname === values.credentialNickname) {
        onCancel();
      } else {
        try {
          setLoading(true);
          await updatePasskeyApi({ id: values.id, credentialNickname });
          onSuccess();
        } catch (error) {
          toast.error(error?.msg || error?.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue(values);
    }
  }, [open, values]);

  return (
    <Modal
      isOpen={open}
      title={_t('a69b8e01e22c4000ac56')}
      okText={_t('confirm')}
      onOk={handleSubmit}
      okButtonProps={{ loading }}
      cancelText={_t('c43851970c1e4000a0a2')}
      onCancel={onCancel}
      onClose={onCancel}
      className={styles.modal}
    >
      <Form form={form} style={{ paddingTop: 8 }}>
        <FormItem
          label={_t('2f4c8f06230d4000ac64')}
          name="credentialNickname"
          required={false}
          rules={[
            {
              required: true,
              whitespace: true,
              message: _t('form.required'),
            },
          ]}
        >
          <Input
            size="xlarge"
            placeholder={_t('2f4c8f06230d4000ac64')}
            fullWidth
            inputProps={{ autoFocus: true, autocomplete: 'off', maxLength: 15 }}
            allowClear
          />
        </FormItem>
      </Form>
    </Modal>
  );
}
