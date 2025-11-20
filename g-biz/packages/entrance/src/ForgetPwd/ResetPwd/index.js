/**
 * Owner: willen@kupotech.com
 */

import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, styled } from '@kux/mui';
import { delay } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import { REGEXP, matchPasswordCheck } from '../../common/tools';
import { NewInputEye, PasswordCheck, PasswordStrength } from '../../components';

import { useToast, useLang } from '../../hookTool';
import { NAMESPACE } from '../constants';

const ExtendForm = styled(Form)`
  .mtSpace {
    margin-top: 8px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 0;
    }
  }
  .KuxForm-itemHelp .KuxForm-itemError {
    line-height: 130%;
    margin-top: 4px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    > .KuxForm-item:nth-of-type(1) {
      margin-bottom: 8px; // 需要间距为32px，其中 formItem 的错误文字高度为24px，需要补齐 8px
    }
    .KuxInput-togglePwdIcon {
      margin-left: 10px;
    }
  }
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: ${({ inDrawer }) => (inDrawer ? '36px' : '40px')};
  line-height: 130%;
  margin-bottom: 32px; // 需要总间距 40px，但是 mtSpace 已经有 8px 了
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 24px;
  }
`;

const { FormItem } = Form;
let timer = null;
const ResetPwd = ({ onSuccess, classes, inDrawer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isPwdError, updatePwdError] = useState(false);
  const loading = useSelector((s) => s.loading.effects[`${NAMESPACE}/resetPwd`]);
  const _password = Form.useWatch('password', form);
  const toast = useToast();
  const { setFields } = form;
  const { t } = useLang();
  const inputRef = useRef(null);

  const matchAllRules = matchPasswordCheck(_password);
  const handleSubmit = async (e) => {
    e && e.preventDefault();
    // 校验表单值
    form.validateFields().then(async ({ password }) => {
      const isOk = await dispatch({
        type: `${NAMESPACE}/resetPwd`,
        payload: { password, toast },
      });
      if (isOk) {
        kcsensorsManualTrack({ spm: ['confirmPassword', '1'] }, 'page_click');
        toast.success(t('bopToEojhPLfQUvu1wgPfs'));
        timer = delay(() => onSuccess?.(isOk), 2000);
      }
    });
  };

  const handleClearError = (name) => {
    setFields([{ name, errors: [] }]);
  };
  const handlePwdFocus = () => {
    handleClearError('password');
  };
  const handlePwdBlur = () => {
    form
      .validateFields(['password'])
      .then(() => {
        kcsensorsManualTrack({ spm: ['insertPassword', '1'] }, 'page_click');
        updatePwdError(false);
      })
      .catch(() => {
        updatePwdError(true);
      });
  };

  // 忘记密码设置密码组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['password', '1'],
    });
    // 进入设置密码，输入框选中
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Title className={classes?.title} inDrawer={inDrawer}>
        {t('jjtBvLWA7FLuFe4HpacBDi')}
      </Title>
      <ExtendForm form={form}>
        <FormItem
          label={t('7DZjKaSedHndJevqcb3uV1')}
          name="password"
          rules={[
            { required: true, whitespace: true, message: t('form.required') },
            {
              pattern: REGEXP.pwd,
              message: t('form.password.error'),
            },
          ]}
          validateTrigger={['onBlur', 'onSubmit']}
        >
          <NewInputEye
            className="mtSpace"
            size="xlarge"
            onFocus={handlePwdFocus}
            autoComplete="new-password"
            onBlur={handlePwdBlur}
            ref={inputRef}
          />
        </FormItem>
        {/* 输入密码不满足要求，则不展示强度 */}
        {matchAllRules && <PasswordStrength password={_password} />}
        <PasswordCheck password={_password} isError={isPwdError} matchAllRules={matchAllRules} />
        <FormItem
          label={t('5V1KtkFvcn4mguSBWD4iyY')}
          name="password2"
          rules={[
            { required: true, whitespace: true, message: t('form.required') },
            {
              pattern: REGEXP.pwd,
              message: t('form.password.error'),
            },
            {
              validator: (rule, value, callback) => {
                if (value !== _password) {
                  callback(t('3q1w6JcjUQjnFo3NyXSdH6'));
                  return;
                }
                callback();
              },
            },
          ]}
          validateTrigger={['onBlur', 'onSubmit', 'onChange']}
        >
          <NewInputEye
            className="mtSpace"
            size="xlarge"
            onFocus={handlePwdFocus}
            autoComplete="new-password"
            onBlur={handlePwdBlur}
          />
        </FormItem>
        <Button
          mt={16}
          type="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          loading={!!loading}
          disabled={!_password}
        >
          {t('isPi1djZSjLwn1K5mVn28f')}
        </Button>
      </ExtendForm>
    </>
  );
};

export default ResetPwd;
