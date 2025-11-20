/**
 * Owner: tiger@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Checkbox, Box, styled, useTheme } from '@kux/mui';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import InputSendCode from '../../components/InputSendCode';
import EmailUnavailableModal from '../../components/EmailUnavailableModal';
import { NAMESPACE } from '../constants';
import { useLang, useToast } from '../../hookTool';
import { kcsensorsClick } from '../../common/tools';

const isThSite = window?._BRAND_SITE_ === 'TH';

const { FormItem } = Form;

const ForbidSMS = styled(Box)`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  text-decoration-line: underline;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  &:last-of-type {
    margin-top: 24px;
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

const Email = (props) => {
  const { validationType, onSuccess, trackResultParams, isSub = false, isAutoSendCode } = props;
  const [form] = Form.useForm();
  const theme = useTheme();
  const toast = useToast();
  const dispatch = useDispatch();
  const { emailRetryAfterSeconds, loadingEmail, email, needValidations } = useSelector(
    (state) => state[NAMESPACE],
  );

  const [disable, setDisable] = useState(false);
  const [isUnavailableModalOpen, setUnavailableModalOpen] = useState(false);

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
      type: 'my_email',
      source: String(needValidations),
    });

    dispatch({
      type: `${NAMESPACE}/sendEmailValidateCode`,
      payload: {
        sendChannel: 'MY_EMAIL',
      },
    });
  };

  const offDisabled = useCallback(() => {
    setDisable(false);
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        emailRetryAfterSeconds: { time: 0 },
      },
    });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: {
          emailRetryAfterSeconds: { time: 0 },
        },
      });
    };
  }, []);

  useEffect(() => {
    if (disable || loadingEmail || !isAutoSendCode) {
      return;
    }
    handleSendCode();
  }, []);

  useEffect(() => {
    if (emailRetryAfterSeconds && emailRetryAfterSeconds.time > 0) {
      setDisable(true);
    }
  }, [emailRetryAfterSeconds]);

  const handleInputSendCode = (val) => {
    if (val.length > 6) {
      return;
    }
    if (val.length === 6) {
      const values = form.getFieldsValue();
      handleSubmit(values);
    }
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
            loading={loadingEmail}
            disabled={disable}
            countTimeOver={offDisabled}
            onSendCode={handleSendCode}
            countTime={emailRetryAfterSeconds}
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {!isSub ? (
          <>
            {/* 收不到邮件 - 弹窗 */}
            <ForbidSMS onClick={() => setUnavailableModalOpen(true)}>
              {t('vV4NomJvsbsmwV8jdsodYA')}
            </ForbidSMS>
            <ForbidSMS
              onClick={() => {
                window.open(
                  isThSite
                    ? 'https://kucoin-th.zendesk.com/hc/requests/new'
                    : addLangToPath('/support/requests', storage.getItem('kucoinv2_lang')),
                  '_blank',
                );
              }}
            >
              {t('t6EfvNQVotmX7WZBJ219Aa')}
            </ForbidSMS>
          </>
        ) : null}
      </div>
      <EmailUnavailableModal
        theme={theme.currentTheme}
        open={isUnavailableModalOpen}
        onCancel={() => setUnavailableModalOpen(false)}
        email={email}
      />
    </Form>
  );
};

export default Email;
