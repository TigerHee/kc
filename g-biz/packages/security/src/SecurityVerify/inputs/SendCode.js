/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import delay from 'lodash/delay';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, useSnackbar } from '@kufox/mui';

import { VER_EMAIL, VER_SMS } from '../../common/constants';
import { namespace } from '../model';
import { useLang } from '../../hookTool';

const actionLabels = {
  [VER_EMAIL]: 'vc_email',
  [VER_SMS]: 'vc_sms',
};

export default ({ action }) => {
  const dispatch = useDispatch();
  const { t } = useLang();
  const { validationCodeLimits } = useSelector((state) => state[namespace]);
  const [timeOut, setTimeOut] = useState(0);
  const { message } = useSnackbar();

  const startTimer = useCallback((seconds) => {
    setTimeOut(seconds);
    if (seconds !== 0) {
      delay(() => {
        startTimer(seconds - 1);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (validationCodeLimits[action]) {
      message.success(t('code_send_success'));
      const { retryAfterSeconds } = validationCodeLimits[action];
      startTimer(retryAfterSeconds);
    }
  }, [validationCodeLimits[action]]);

  const handleSend = () => {
    dispatch({
      type: `${namespace}/sendValidationCode`,
      payload: {
        sendChannel: action,
      },
    });
  };

  return (
    <Form.FormItem
      name={action}
      label={t(actionLabels[action])}
      rules={[
        { required: true, message: t('verify_code_required') },
        { type: 'string', pattern: /^\d{6}$/, message: t('verify_code_format') },
      ]}
      required={false}
    >
      <Input
        size="large"
        suffix={
          timeOut === 0 ? (
            <Button variant="text" onClick={handleSend} style={{ marginRight: 20, fontSize: 14 }}>
              {t('send')}
            </Button>
          ) : (
            <div style={{ minWidth: 60, textAlign: 'center' }}>{timeOut}&nbsp;s</div>
          )
        }
      />
    </Form.FormItem>
  );
};
