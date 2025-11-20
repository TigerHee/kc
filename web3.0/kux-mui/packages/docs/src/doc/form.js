/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Checkbox,
  Button,
  InputNumber,
  DatePicker,
  TextArea,
  Select,
  Row,
  Col,
  Box,
  styled,
} from '@kux/mui';
import Wrapper from './wrapper';
import moment from 'moment';

const CusFormItem = styled(Form.FormItem)`
  color: yellow;
`;

const CheckboxGroup = Checkbox.Group;

const _t = (v) => v;

const { FormItem, useForm, withForm, useWatch } = Form;

const BaseFormExample = () => {
  const [form] = useForm();

  return (
    <Form form={form} style={{ width: 380 }}>
      <Form.FormItem
        initialValue={[]}
        name="bizType"
        rules={[
          {
            required: true,
            message: 'kyc.form.required',
          },
        ]}
        validateTrigger={['onSubmit']}
        label="biz.type"
      >
        <CheckboxGroup options={[]}>
          <Row gutter={[24, 8]}>
            <Col>
              <Checkbox value="FREEZE_USER">{_t('biz.types.freezeAccount')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="UNFREEZE_USER">{_t('biz.types.thawAccount')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="UPDATE_EMAIL">{_t('biz.types.modifyEmail')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="UNBIND_PHONE">{_t('biz.types.unbindPhone')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="APPLY_REST_WITHDRAW_PASSWORD">
                {_t('biz.types.removeTradePwd')}
              </Checkbox>
            </Col>
            <Col>
              <Checkbox value="UNFREEZE_WITHDRAW">{_t('biz.types.thawWithdraw')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="FREEZE_ORDER">{_t('biz.types.freezeTrade')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="UNFREEZE_ORDER">{_t('biz.types.thawTrade')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="UNBIND_2FA">{_t('biz.type.unbindG2FA')}</Checkbox>
            </Col>
            <Col>
              <Checkbox value="RESET_SECURITY_QUESTION">
                {_t('biz.types.resetSecurityQuestions')}
              </Checkbox>
            </Col>
            <Col>
              <Checkbox value="info">{_t('biz.types.any')}</Checkbox>
            </Col>
          </Row>
          {/* <Checkbox value="H">{_t('biz.types.thawTrade')}</Checkbox> */}
          <Box>
            <Input size="large" />
          </Box>
        </CheckboxGroup>
      </Form.FormItem>
      {/* <FormItem
        label={
          <div style={{ display: 'inline' }}>
            <span>姓名</span>
            <div>请填写全名</div>
          </div>
        }
        rules={[{ required: true, message: '姓名必填' }]}
        name="name"
      >
        <Input autoComplete="on" />
      </FormItem> */}
      {/* <FormItem label="密码" name="password" rules={[{ required: true, message: '必填' }]}>
        <Input autoComplete="on" type="password" />
      </FormItem>
      <FormItem label="amount" name="amount">
        <InputNumber />
      </FormItem> */}
      <FormItem label="icon" name="icon" initialValue={1}>
        <Select
          allowClear
          options={[
            {
              value: 1,
              label: '选项1',
              title: '选项1',
            },
            {
              value: 2,
              label: '选项2',
              title: '选项2',
            },
            {
              value: 3,
              label: '选项3',
              title: '选项3',
            },
          ]}
        />
      </FormItem>
      <Button
        style={{ width: '100%' }}
        onClick={() => {
          form
            .validateFields()
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        提交
      </Button>
    </Form>
  );
};

const RenderPropsExample = () => {
  return (
    <Form style={{ width: 380 }}>
      {(values, form) => {
        return (
          <>
            <FormItem label="姓名" rules={[{ required: true, message: '姓名必填' }]} name="name">
              <Input autoComplete="off" />
            </FormItem>
            <FormItem
              valuePropName="checked"
              rules={[
                {
                  type: 'enum',
                  enum: ['true'],
                  required: true,
                  message: '必须开启',
                  transform: (value) => value.toString(),
                },
              ]}
              name="switch"
            >
              <Checkbox>同意</Checkbox>
            </FormItem>
            <Button
              style={{ width: '100%' }}
              onClick={() => {
                form
                  .validateFields()
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              提交
            </Button>
          </>
        );
      }}
    </Form>
  );
};

const WithFormExample = withForm({ initialValues: { name: '123123' }, name: 'withForm' })(
  (props) => {
    const { form } = props;

    return (
      <div style={{ width: 380 }}>
        <FormItem label="姓名" rules={[{ required: true, message: '必填' }]} name="name">
          <Input autoComplete="off" />
        </FormItem>
        <FormItem label="地址" rules={[{ required: true, message: '必填' }]} name="address">
          <Input autoComplete="off" />
        </FormItem>
        <Button onClick={() => form.validateFields()}>Submit</Button>
      </div>
    );
  },
);

const FormDoc = () => {
  const [form] = Form.useForm();
  const name = Form.useWatch('name', form);

  const handleFinish = (values) => {
    console.log(values, '--------');
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Input size="xlarge" placeholder="Input No Form No Label" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <InputNumber size="xlarge" placeholder="InputNumber No Form No Label" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <TextArea size="xlarge" placeholder="TextArea No Form No Label" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <TextArea
          size="xlarge"
          placeholder="TextArea With Label"
          label="钱包地址"
          addonAfter={<span>ABCD</span>}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <DatePicker size="xlarge" placeholder="DatePicker No Form No Label" />
      </div>

      <Form form={form} onFinish={handleFinish}>
        <CusFormItem
          name="email"
          label=""
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
          className="formItem"
        >
          <Input size="xlarge" placeholder="In Form No Label" />
        </CusFormItem>
        <FormItem
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
        >
          <Input size="xlarge" />
        </FormItem>
        <FormItem
          name="pwd"
          label="Login Password"
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
        >
          <Input size="xlarge" type="password" />
        </FormItem>
        <FormItem
          name="name"
          label="姓"
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
        >
          <Input size="xlarge" />
        </FormItem>
        <FormItem
          name="age"
          label="年龄"
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
        >
          <Input size="xlarge" type="password" />
        </FormItem>

        <FormItem
          name="amount"
          label="金额"
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
        >
          <InputNumber size="xlarge" />
        </FormItem>

        <FormItem
          name="des"
          label="这是描述"
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
        >
          <TextArea size="xlarge" />
        </FormItem>

        <FormItem
          name="birth"
          label="生日"
          rules={[
            {
              required: true,
              message: '请填写',
            },
          ]}
        >
          <DatePicker size="xlarge" allowClear />
        </FormItem>

        {/* <FormItem name="pwd" label="Name" required>
          <Input type="password" data-testid="ipt2" />
        </FormItem> */}
        <FormItem>
          <Button htmlType="submit" size="large">
            提交
          </Button>
        </FormItem>
      </Form>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <FormDoc />
    </Wrapper>
  );
};
