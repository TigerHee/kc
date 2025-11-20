/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import isUndefined from 'lodash/isUndefined';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Box, useSnackbar } from '@kufox/mui';

import { VER_EMAIL, VER_G2FA, VER_PASSWORD, VER_SMS } from '../common/constants';
import Password from './inputs/Password';
import SendCode from './inputs/SendCode';
import G2fa from './inputs/G2fa';
import { namespace } from './model';
import { loopCrypto } from '../common/tools';
import { useLang } from '../hookTool';

const { useForm } = Form;

const FormControls = {
  [VER_EMAIL]: {
    Component: SendCode,
    asyncError: 'verify_email_error',
  },
  [VER_SMS]: {
    Component: SendCode,
    asyncError: 'verify_sms_error',
  },
  [VER_G2FA]: {
    Component: G2fa,
    asyncError: 'verify_2fa_error',
  },
  [VER_PASSWORD]: {
    Component: Password,
    asyncError: 'verify_pwd_error',
  },
};

const VerifyForm = (props) => {
  const { actions } = props;
  const { errorMsg } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const [form] = useForm();

  const { t } = useLang();

  useEffect(() => {
    if (errorMsg) {
      message.error(errorMsg);
    }
  }, [errorMsg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    form
      .validateFields()
      .then((values) => {
        const postValues = values;
        if (!isUndefined(postValues[VER_PASSWORD])) {
          postValues[VER_PASSWORD] = loopCrypto(postValues[VER_PASSWORD], 2);
        }
        dispatch({
          type: `${namespace}/verify`,
          payload: postValues,
        });
      })
      .catch((e) => {
        console.log('e:', e);
      });
  };

  // const asyncError =
  //   find(errors, (o) => {
  //     return o.validationType === action.toLowerCase();
  //   }) && FormControls[action].asyncError;

  return (
    <Form form={form}>
      {actions.map((action) => {
        const FormControl = FormControls[action].Component;
        return <FormControl form={form} action={action} key={action} />;
      })}
      <Box mt={7}>
        <Button fullWidth size="large" onClick={handleSubmit}>
          {t('confirm')}
        </Button>
      </Box>
    </Form>
  );
};

export default VerifyForm;
