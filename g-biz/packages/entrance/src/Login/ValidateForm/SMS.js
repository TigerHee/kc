/**
 * Owner: tiger@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Checkbox, Box, styled, useTheme } from '@kux/mui';
import InputSendCode from '../../components/InputSendCode';
import VoiceCode from '../../components/NewVoiceCode';
import { NAMESPACE } from '../constants';
import { useLang, useToast } from '../../hookTool';
import { kcsensorsClick } from '../../common/tools';

const { FormItem } = Form;

const ForbidSMS = styled(Box)`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 24px;
  text-decoration-line: underline;
  span {
    cursor: pointer;
  }
`;

const CodeWrapper = styled.div`
  .KuxForm-itemHelp {
    min-height: 0px;
  }
`;

const FormItemWrapper = styled.div`
  margin: 24px 0;
  .KuxForm-itemHelp {
    min-height: 0px;
  }
  .KuxCheckbox-wrapper {
    display: inline-block;
  }
  .KuxCheckbox-wrapper input {
    display: unset;
  }
  .KuxCheckbox-wrapper > span {
    display: unset;
  }
  .KuxCheckbox-wrapper > .KuxCheckbox-checkbox {
    display: inline-block;
  }
  .KuxCheckbox-wrapper > span > span {
    display: flex;
    border: 2px solid ${({ theme }) => theme.colors.text40};
  }
  .KuxCheckbox-wrapper .KuxCheckbox-inner {
    width: 18.3px;
    height: 18.3px;
  }
  .KuxCheckbox-checked .KuxCheckbox-inner {
    border: 2px solid ${({ theme }) => theme.colors.text};
  }
  .KuxCheckbox-inner {
    border: 2px solid ${({ theme }) => theme.colors.text};
  }
`;

const SMS = (props) => {
  const {
    validationType,
    onSuccess,
    verifyCanNotUseClick,
    trackResultParams,
    isSub = false,
    isAutoSendCode,
  } = props;
  const theme = useTheme();
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(false);

  const toast = useToast();

  const dispatch = useDispatch();
  const {
    smsRetryAfterSeconds,
    token,
    // gfaBtnLoading,
    loadingSms,
    // sendChannel = '',
    countryCode = '',
    phone,
    needValidations,
  } = useSelector((state) => state[NAMESPACE]);

  const { t } = useLang();

  const handleSubmit = (values) => {
    dispatch({
      type: `${NAMESPACE}/validate`,
      payload: {
        ...values,
        validationType,
        toast,
      },
      onSuccess,
      trackResultParams,
    });
  };

  const handleSendCode = () => {
    kcsensorsClick(['send_login_verify', '1'], {
      type: 'my_sms',
      source: String(needValidations),
    });
    dispatch({
      type: `${NAMESPACE}/sendSms`,
      payload: {
        sendChannel: 'MY_SMS',
      },
    });
  };

  const onSendVoice = () => {
    return dispatch({
      type: `${NAMESPACE}/sendSms`,
      payload: {
        sendChannel: 'MY_VOICE',
        toast,
      },
    });
  };

  const offDisabled = useCallback(() => {
    setDisable(false);
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        smsRetryAfterSeconds: { time: 0 },
      },
    });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: {
          smsRetryAfterSeconds: { time: 0 },
        },
      });
    };
  }, []);

  useEffect(() => {
    if (disable || loadingSms || !isAutoSendCode) {
      return;
    }
    handleSendCode();
  }, []);

  useEffect(() => {
    if (smsRetryAfterSeconds && smsRetryAfterSeconds.time > 0) {
      setDisable(true);
    }
  }, [smsRetryAfterSeconds]);

  const handleInputSendCode = (val) => {
    if (val.length > 6) {
      return;
    }
    if (val.length === 6) {
      const values = form.getFieldsValue();
      handleSubmit(values);
    }
  };

  const validateForVoice = () => {
    return Promise.resolve();
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <CodeWrapper>
        <FormItem
          name="code"
          requiredMark={false}
          // rules={[{ required: true, message: t('form.required') }]}
          label={t('gfa.vc.sms')}
        >
          <InputSendCode
            loading={loadingSms}
            disabled={disable}
            countTimeOver={offDisabled}
            onSendCode={handleSendCode}
            countTime={smsRetryAfterSeconds}
            autoFocus
            size="large"
            onChange={handleInputSendCode}
          />
        </FormItem>
      </CodeWrapper>
      <FormItemWrapper>
        <FormItem initialValue={false} valuePropName="checked" name="trustDevice">
          <Checkbox
            checkOptions={{
              type: 2,
              checkedType: 1,
            }}
          >
            {t('gfa.trust')}
          </Checkbox>
        </FormItem>
      </FormItemWrapper>
      {/* <Button
        fullWidth
        htmlType="submit"
        size="large"
        loading={gfaBtnLoading}
        disabled={gfaBtnLoading}
      >
        {t('gfa.btn')}
      </Button> */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <VoiceCode
          validateFunc={validateForVoice}
          phone={phone || '***'}
          countryCode={countryCode}
          countTime={smsRetryAfterSeconds}
          loading={loadingSms}
          disable={disable}
          onTimeOver={offDisabled}
          onSend={onSendVoice}
          theme={theme?.currentTheme}
        />

        {verifyCanNotUseClick && !isSub ? (
          <ForbidSMS>
            <span
              onClick={() => {
                verifyCanNotUseClick('SMS', token);
              }}
            >
              {t('phone.unvaliable')}
            </span>
          </ForbidSMS>
        ) : null}
      </div>
    </Form>
  );
};

export default SMS;
