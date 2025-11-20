/**
 * Owner: corki@kupotech.com
 */
import { Button, Form, styled } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import React from 'react';
import { pasteFromClipboard } from '../../common/tools';
import { AccountInput } from './styled';

const { FormItem } = Form;

const Text = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
`;

const noop = () => {};

const StyledFormItem = styled.div`
  margin-bottom: 24px;
  .KuxForm-itemHelp {
    display: ${({ hasHelp }) => (hasHelp ? 'block' : 'none')};
    min-height: 20px;
  }
  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-end;
      justify-content: flex-start;
      height: 100%;
      margin-top: 0px;
    }
  }
`;

const CodeWrapper = styled.div`
  .KuxForm-itemHelp {
    min-height: 0px;
  }
`;

const FormItemLabel = styled.div`
  [dir='rtl'] & {
    text-align: left;
  }
`;

const formItemLayout = {
  required: false,
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const GFA = (props = {}) => {
  const { value, onChange = noop, allowClear = true } = props;
  const [form] = Form.useForm();

  const { t } = useTranslation('entrance');

  // 校验器，校验输入的长度
  const validator = (rule, value, callback) => {
    if (!value || value.length !== 6) {
      callback(new Error(t('form.format.error')));
      onChange({
        value,
        error: true,
      });
    } else {
      callback();
    }
  };

  const handleReFocus = (key) => {
    if (form.getFieldError(key)?.length > 0) {
      const placeHolder = '******'; // 合法校验占位符
      const formValue = form.getFieldValue(key);
      form.setFieldsValue({ [key]: placeHolder });
      form.validateFields([key]); // 去除错误提示
      form.setFieldsValue({ [key]: formValue });
    }
  };

  const handlePaste = async () => {
    const text = await pasteFromClipboard(value);
    if (text) {
      form.setFieldsValue({ google_2fa: text.length > 6 ? text.slice(0, 6) : text });
      onChange({
        value: text,
        error: text.length !== 6,
      });
    }
  };

  const handleChange = (target) => {
    if (form.getFieldError('google_2fa')?.length > 0) {
      onChange({
        value: target,
        error: true,
      });
    } else {
      onChange({
        value: target,
        error: false,
      });
    }
  };

  const handleAutoCheck = (value) => {
    if (value.length === 6) {
      handleChange(value);
    } else {
      onChange({
        value,
        error: true, // 重置提示按钮状态
      });
    }
  };

  return (
    <Form form={form}>
      <CodeWrapper>
        <StyledFormItem name="google_2fa" requiredMark={false} key="google_2fa" hasHelp>
          <FormItem
            {...formItemLayout}
            label={<FormItemLabel>{t('g2fa.code')}</FormItemLabel>}
            name="google_2fa"
            validateStatus="success"
            initialValue={value}
            rules={[
              {
                validator,
              },
            ]}
            validateTrigger={['onBlur']}
            validateFirst
          >
            <AccountInput
              inputProps={{ maxLength: 6 }}
              value={value}
              onBlur={(e) => handleChange(e.target.value)}
              onChange={(e) => handleAutoCheck(e.target.value)}
              addonAfter={null}
              suffix={
                <Button variant="text" type="primary" onClick={handlePaste}>
                  <Text>{t('d4e7737fe8304000a14b')}</Text>
                </Button>
              }
              size="xlarge"
              onFocus={() => handleReFocus('google_2fa')}
              allowClear={allowClear}
              prefix={t('g2fa.code')}
              data-inspector="entrance_g2fa_verify_input"
            />
          </FormItem>
        </StyledFormItem>
      </CodeWrapper>
    </Form>
  );
};

export default GFA;
