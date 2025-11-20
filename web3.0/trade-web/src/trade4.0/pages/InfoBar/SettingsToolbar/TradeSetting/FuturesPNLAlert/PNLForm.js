/**
 * Owner: clyne@kupotech.com
 */

import { styled } from '@/style/emotion';
import React, { memo, useEffect } from 'react';
import useI18n from '@/hooks/futures/useI18n';
import Input from '@mui/Input';
import Form from '@mui/Form';

import { multiply } from 'utils/operation';

import { rates } from './config';
import { useActionSubmit, useDialog, usePnlForm } from './hooks/usePnlForm';
import ButtonGroup from './ButtonGroup';

const Wrapper = styled.div`
  .group-items {
    display: flex;
  }
  .KuxForm-itemHelp {
    min-height: 16px;
    display: none;
  }
  .item-button {
    width: calc((100% - 28px) / 5);
    border-radius: 8px;
    color: ${(props) => props.theme.colors.text60};
  }
  .item-button + .item-button {
    margin-left: 7px;
  }
  .message {
    font-size: 14px;
    font-weight: 400;
    margin-top: 16px;
  }
  .error {
    color: ${(props) => props.theme.colors.secondary};
  }
  .warning {
    color: ${(props) => props.theme.colors.complementary};
  }
`;

const { FormItem, useWatch } = Form;

const PNLForm = ({ form }) => {
  const { _t } = useI18n();
  const inputLabel = _t('setting.pnl.roe');
  const rate = useWatch('unrealisedRoePcnt', form);
  const { alertInfo } = useDialog();
  const { formSubmit } = useActionSubmit(form);
  const { onButtonChange, validator, msg = {}, onValuesChange, onFinishFailed } = usePnlForm(form);
  const { msgType, info } = msg;
  // 规则
  const rules = [
    {
      validator,
    },
  ];

  useEffect(() => {
    // 详情有值，设置一个表单值
    if (alertInfo?.unrealisedRoePcnt) {
      form.setFieldsValue({ unrealisedRoePcnt: multiply(alertInfo.unrealisedRoePcnt)(100) });
    }
    // 不需要监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertInfo]);

  return (
    <Wrapper>
      <Form
        form={form}
        onValuesChange={onValuesChange}
        onFinish={formSubmit}
        onFinishFailed={onFinishFailed}
      >
        <FormItem label={inputLabel} name="unrealisedRoePcnt" rules={rules}>
          <Input type="text" placeholder={inputLabel} size="large" helperText={null} allowClear />
        </FormItem>
        <ButtonGroup config={rates} value={rate} onChange={onButtonChange} />
        <div className={`message ${msgType}`}>{info}</div>
      </Form>
    </Wrapper>
  );
};

export default memo(PNLForm);
