/**
 * Owner: borden@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Box, Button, Form, Radio, styled } from '@kux/mui';
import { map } from 'lodash-es';
import { memo, useContext, useEffect, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { kcsensorsManualExpose, saTrackForBiz, trackClick } from 'utils/ga';
import { REASON_TYPES, REASON_TYPES_MAP } from '../config';
import { Context } from '../index';
import GuideModal from './GuideModal';

const RadioGroup = Radio.Group;
const { FormItem, useForm } = Form;

// --- 样式 start ---
const Header = styled.h2`
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;
const Reason = styled.section`
  label {
    display: flex;
    color: ${(props) => props.theme.colors.text60};
    :not(:first-child) {
      margin-top: 16px;
    }
  }
  .KuxRadio-inner {
    &:after {
      background: ${(props) => props.theme.colors.text};
    }
  }
`;
const TextArea = styled.textarea`
  width: 100%;
  border: none;
  padding: 12px;
  resize: none;
  margin-top: 16px;
  border-radius: 6px;
  background: ${(props) => props.theme.colors.cover4};
  color: ${(props) => props.theme.colors.text60};
  :focus-visible {
    outline: none;
  }
  ::-webkit-input-placeholder {
    color: ${(props) => props.theme.colors.text40};
  }
  :-ms-input-placeholder {
    color: ${(props) => props.theme.colors.text40};
  }
  :-moz-placeholder {
    color: ${(props) => props.theme.colors.text40};
    opacity: 1;
  }
`;
const Operate = styled.section`
  display: flex;
  flex-direction: column;
`;

const Text = styled.span`
  color: ${(props) => props.theme.colors.text};
`;

// --- 样式 end ---

export default memo(() => {
  useLocale();
  const { checkSecurity, setReason, reason } = useContext(Context);
  const [form] = useForm();

  const { validateFields } = form;
  const initReasonType = reason?.reasonType || REASON_TYPES[0].value;

  const confirmLoading = useSelector(
    (state) =>
      state.loading.effects['security_new/cancellationAccount'] ||
      state.loading.effects['security_new/get_verify_type'],
  );

  const [open, setOpen] = useState(false);
  const [reasonType, updateReasonType] = useState(initReasonType);

  const handleSubmit = () => {
    trackClick(['ThreeStepNextButton', '1']);
    validateFields().then((vals) => {
      if (setReason) setReason(vals);
      if (REASON_TYPES_MAP[vals.reasonType]?.showGuideModal) {
        setOpen(true);
      } else if (checkSecurity) {
        checkSecurity();
      }
    });
  };

  const handleValusChange = (v) => {
    if (v?.reasonType) {
      updateReasonType(v.reasonType);
    }
  };

  useEffect(() => {
    saTrackForBiz({}, ['ThreeStepNextButton', '1']);
    kcsensorsManualExpose(['Verify', '1']);
  }, []);

  return (
    <div>
      <Box style={{ height: '28px' }} />
      <Header>{_t('gR6nxe8NS9p6hiiia8LstZ')}</Header>
      <Form form={form} size="small" name="DeleteAccountReasons" onValuesChange={handleValusChange}>
        <Reason>
          <FormItem noStyle name="reasonType" initialValue={initReasonType}>
            <RadioGroup disabled={confirmLoading}>
              {map(REASON_TYPES, (item) => {
                return (
                  <Radio key={item.value} value={item.value}>
                    <Text>{_t(item.label)}</Text>
                  </Radio>
                );
              })}
            </RadioGroup>
          </FormItem>
        </Reason>
        <FormItem
          name="remark"
          initialValue={reason?.remark}
          rules={[
            {
              required: !!REASON_TYPES_MAP?.[reasonType]?.remarkRequired,
              message: _t('form.required'),
            },
          ]}
        >
          <TextArea
            rows={7}
            inputProps={{ maxLength: 255 }}
            disabled={confirmLoading}
            placeholder={_t('3PeVTWTmU5Lwdar7GuhieX')}
          />
        </FormItem>
        <Operate>
          <Button
            data-inspector="deleteAccount_next"
            loading={confirmLoading}
            size="large"
            onClick={handleSubmit}
          >
            {_t('xiTx5vKPMTgXB5nJ8bSdkP')}
          </Button>
        </Operate>
      </Form>
      <GuideModal
        open={open}
        title={_t('g1B9ib66AvonBhsMSsy2zR')}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
});
