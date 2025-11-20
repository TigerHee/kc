/**
 * Owner: tom@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { trim } from 'lodash';
import { Form, Input, Button } from '@kufox/mui';
import { useSnackbar } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { _t } from 'tools/i18n';
import { REGEXP } from '../common/config';
import { StepTitle } from '../common/StyledComps';
import { isTelegramIDValid } from 'utils/telegram';

const { FormItem, useForm } = Form;

const FormStyle = styled(Form)`
  width: 588px;
  margin-top: 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 15px;
  }
`;

const FormTip = styled.div`
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text40};
`;

const SubmitButton = styled(Button)`
  min-width: 282px;
  margin-top: 50px;
  border-radius: 6px;
  font-weight: 500;
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: 100%;
    margin-top: 44px;
  }
`;

function StepOne() {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { detail } = useSelector((state) => state.listing);
  const loading = useSelector((state) => state.loading.effects['listing/saveDraft']);

  const [form] = useForm();
  const email = Form.useWatch('email', form);
  const telegramId = Form.useWatch('telegramId', form);
  const antiPhishingCode = Form.useWatch('antiPhishingCode', form);
  const btnDisable = email && telegramId && antiPhishingCode ? false : true;

  useEffect(() => {
    form.setFieldsValue({
      email: detail.email,
      telegramId: detail.telegramId,
      antiPhishingCode: detail.antiPhishingCode,
    });
  }, []);

  const handleNext = () => {
    form.validateFields().then((values) => {
      const params = {
        email: trim(values.email),
        telegramId: trim(values.telegramId),
        antiPhishingCode: trim(values.antiPhishingCode),
      };
      dispatch({
        type: 'listing/saveDraft',
        payload: {
          ...params,
        },
      }).then((res) => {
        const { success, code, data } = res || {};
        if (success && data && code === '200') {
          dispatch({
            type: 'listing/update',
            payload: {
              applyCurrentStep: 1,
              detail: { ...detail, ...params },
            },
          });
        } else {
          message.error(_t('kMRN1jq8WnLWWXgo7tSCEh'));
        }
      });
    });
  };

  return (
    <>
      <StepTitle>{_t('4kVLxDS9jFDAsLPbMqBMC9')}</StepTitle>
      <FormStyle form={form}>
        <FormItem
          label={_t('ek1KnQQE95S8eAGaDFHuJA')}
          name="email"
          rules={[
            { required: true, message: _t('7a5dAnbHaPa6cT5aRvx1Zo') },
            {
              validator: (_, val, cb) => {
                if (!REGEXP.email.test(val)) {
                  cb(_t('9m6cTSyWNnNPaHVBEhFydz'));
                  return;
                }
                if (val.length > 50) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 50 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('7a5dAnbHaPa6cT5aRvx1Zo')} size="large" />
        </FormItem>
        <FormItem
          label={_t('aLT58Jtxc2R3CdeNxtoHvR')}
          name="telegramId"
          rules={[
            { required: true, message: _t('4sNdp8eLdJ6Ae5aJfHB8D8') },
            {
              validator: (_, val, cb) => {
                if (!isTelegramIDValid(val)) {
                  cb(_t('6q3nvPm1r4y4x1ewgQiRTU'));
                  return;
                }
                if (val.length > 40) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 40 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('4sNdp8eLdJ6Ae5aJfHB8D8')} size="large" />
        </FormItem>
        <FormItem
          label={_t('pRYAxfiSZKkHbdUGgWDJWy')}
          name="antiPhishingCode"
          rules={[
            { required: true, message: _t('qsSvFAgXgCgKxHGs7Z5bnX') },
            {
              validator: (_, val, cb) => {
                if (!REGEXP.en_and_num.test(val)) {
                  cb(_t('6q3nvPm1r4y4x1ewgQiRTU'));
                  return;
                }
                if (val.length < 8) {
                  cb(_t('qsSvFAgXgCgKxHGs7Z5bnX'));
                  return;
                }
                if (val.length > 8) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 8 }));
                  return;
                }
                cb();
              },
            },
          ]}
          help={<FormTip>{_t('wmGJdKvuj4zB9XdDrTYbBq', { num: 8 })}</FormTip>}
        >
          <Input placeholder={_t('qsSvFAgXgCgKxHGs7Z5bnX')} size="large" />
        </FormItem>
      </FormStyle>
      <SubmitButton size="large" loading={loading} disabled={btnDisable} onClick={handleNext}>
        {_t('hc8AVtnbYdDu2XtUazZwGC')}
      </SubmitButton>
    </>
  );
}

export default StepOne;
