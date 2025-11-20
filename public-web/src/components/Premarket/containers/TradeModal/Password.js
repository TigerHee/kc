/**
 * Owner: solar.xia@kupotech.com
 */
import { Alert, Checkbox } from '@kux/mui';
import { useDebounceFn } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import { Form, Input, Modal } from '../../components';
import { StyledPasswordInput } from './styledComponent';
const { useForm, FormItem } = Form;
// 密码输入弹窗
export default function PasswordInput({ open, panOpen, onClose, onConfirm }) {
  const dispatch = useDispatch();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [form] = useForm();

  const { run: handleConfirm } = useDebounceFn(
    function () {
      return form.validateFields().then(() => {
        return onConfirm();
      });
    },
    { wait: 3000, leading: true, trailing: false },
  );

  const process2Open = useMemo(() => {
    return open && !panOpen;
  }, [open, panOpen]);

  useEffect(() => {
    if (open) {
      form?.resetFields();
      setConfirmChecked(false);
    }
  }, [open, form]);

  function handleClose() {
    onClose();
  }

  const handleChecked = (e) => {
    setConfirmChecked(e.target.checked);
  };

  return (
    <Modal
      disabledConfirm={!confirmChecked}
      open={process2Open}
      onClose={handleClose}
      title={_t('7o943w3PrRwzxaA3f75hqS')}
      onConfirm={handleConfirm}
      drawerHeightSize="sm"
    >
      <StyledPasswordInput>
        <Form form={form}>
          <Input hidden type="password" autocomplete="new-password" style={{ display: 'none' }} />
          <FormItem
            rules={[
              {
                required: true,
                message: _t('form.required'),
              },
              {
                validator: (rule, value, callback) => {
                  dispatch({
                    type: 'aptp/verify',
                    payload: {
                      password: value,
                    },
                  }).then((res) => {
                    if (!res) {
                      callback();
                      return;
                    }
                    callback(res);
                  });
                },
              },
            ]}
            name="password"
            label={_t('new.currency.subscribe.tradingPassword')}
            validateTrigger={[]}
          >
            <Input
              placeholder={_t('7o943w3PrRwzxaA3f75hqS')}
              className="password"
              type="password"
            />
          </FormItem>
        </Form>
        <Alert type="warning" description={_t('g985xbTakaXAEfHhdJqZYF')} />
        <Checkbox className="agreement-check" onChange={handleChecked} checked={confirmChecked}>
          {_tHTML('aAgh8wT8r6AQwnekgUzxcX', {
            agreementUrl: 'https://www.kucoin.com/announcement/Pre-Market-Trading-User-Agreement',
          })}
        </Checkbox>
      </StyledPasswordInput>
    </Modal>
  );
}
