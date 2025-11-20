/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Checkbox, Box, styled } from '@kux/mui';
import { InputPwdBox } from '../../components';
import { NAMESPACE } from '../constants';
import { useLang, useToast } from '../../hookTool';

const { FormItem } = Form;

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
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 24px 0;
  }
`;

const PasswordWrapper = styled.div`
  .KuxForm-itemHelp {
    min-height: 0px;
  }
`;

const Unvaliable = styled(Box)`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.text};
  span {
    cursor: pointer;
  }
`;

const GFA = (props) => {
  const {
    validationType,
    onSuccess,
    verifyCanNotUseClick,
    isSub = false,
    trackResultParams,
  } = props;

  const [form] = Form.useForm();

  const toast = useToast();

  const dispatch = useDispatch();

  const { token, finishUpgrade, gfaBtnLoading } = useSelector((state) => state[NAMESPACE]);

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

  const handleItemPwd = (e) => {
    const val = e.target ? e.target.value : e;
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
      <PasswordWrapper>
        <FormItem
          requiredMark={false}
          // rules={[{ required: true, message: t('form.required') }]}
          name="code"
          label={t('gfa.vc.google')}
        >
          <InputPwdBox type="text" onChange={handleItemPwd} />
        </FormItem>
      </PasswordWrapper>
      <FormItemWrapper>
        <FormItem initialValue={false} valuePropName="checked" name="trustDevice">
          <Checkbox
            className="trust"
            checkOptions={{
              type: 2,
              checkedType: 1,
            }}
            loading={gfaBtnLoading}
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
      {verifyCanNotUseClick && !isSub ? (
        <Unvaliable>
          <span
            onClick={() => {
              verifyCanNotUseClick('GFA', token, finishUpgrade);
            }}
          >
            {t('g2fa.unvaliable')}
          </span>
        </Unvaliable>
      ) : null}
    </Form>
  );
};

export default GFA;
