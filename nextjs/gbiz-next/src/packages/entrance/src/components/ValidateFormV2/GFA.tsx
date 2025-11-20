/**
 * Owner: corki@kupotech.com
 */
import { Button, Form, Input } from '@kux/design';
import React from 'react';
import JsBridge from "tools/jsBridge";
import { pasteFromClipboard } from '../../common/tools';
import { useLang } from '../../hookTool';
import styles from './styles.module.scss';
import clsx from 'clsx';

const { FormItem } = Form;

const noop = () => {};

const isIOS = () => /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);

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

export interface Props {
  className?: string
  defaultValue?: string;
  onChange: (params: { value: string, error: boolean }) => void;
  allowClear: boolean;
}

const GFA = (props: Props) => {
  const { defaultValue = '', className = '', onChange = noop, allowClear = true } = props;
  const [form] = Form.useForm();

  const { t } = useLang();

  const handleFinish = (e) => {
    e.preventDefault();
  }

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

  const handleReFocus = () => {
    form.setFields([{ name: 'google_2fa', errors: [] }]);
  };

  const handlePaste = async () => {
    let text: string | undefined;
    if (JsBridge.isApp()) {
      text = await JsBridge.getPasteBoardContent()
    } else {
      text = await pasteFromClipboard();
    }
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
    <Form form={form} onFinish={handleFinish} className={className}>
      <div className={styles.codeWrapper}>
        <div className={clsx(styles.formItem)}>
          <FormItem
            {...formItemLayout}
            label={<div className={styles.formItemLabel}>{t('g2fa.code')}</div>}
            name="google_2fa"
            validateStatus="success"
            initialValue={defaultValue}
            rules={[
              {
                validator,
              },
            ]}
            validateTrigger={['onBlur']}
            validateFirst
          >
            <Input
              className={styles.input}
              inputProps={{ maxLength: 6 }}
              onBlur={(e) => handleChange(e.target.value)}
              onChange={(e) => handleAutoCheck(e.target.value)}
              addonAfter={null}
              autoComplete="off"
              fullWidth
              suffix={
                <Button type="text" onClick={handlePaste}>
                  <span className={styles.text}>{t('d4e7737fe8304000a14b')}</span>
                </Button>
              }
              size="medium"
              onFocus={handleReFocus}
              allowClear={allowClear}
              label={t('g2fa.code')}
              data-inspector="entrance_g2fa_verify_input"
            />
          </FormItem>
        </div>
      </div>
    </Form>
  );
};

export default GFA;
