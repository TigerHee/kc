import { BoringAvatar } from '@/components/BoringAvatar';
import { updateSelfUserInfo } from '@/services/user';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Form, message } from 'antd';
import { API } from 'types';

const BasicInfoForm: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const initialValues = {
    avatar: currentUser?.avatar,
    name: currentUser?.name,
    email: currentUser?.email,
    phone: currentUser?.phone,
    terminalPassword: currentUser?.terminalPassword,
  };
  const handleFinished = (values: API.UserItem) => {
    console.log('submit', values);
    updateSelfUserInfo(values).then(() => {
      message.success('更新成功');
    });
  };
  return (
    <ProCard>
      <ProForm
        layout="vertical"
        onFinish={handleFinished}
        submitter={{
          searchConfig: {
            submitText: '更新基本信息',
          },
          render: (_, dom) => dom[1],
        }}
        initialValues={initialValues}
        hideRequiredMark
      >
        <Form.Item label="头像" name="avatar">
          <Avatar
            src={<BoringAvatar name={initialValues.name || ''} size={64} />}
            shape="square"
            size={64}
          />
        </Form.Item>

        <ProFormText
          width="md"
          name="name"
          label="姓名"
          disabled
          rules={[
            {
              required: true,
              message: '请输入您的姓名!',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
          disabled
          rules={[
            {
              required: true,
              message: '请输入您的邮箱!',
            },
          ]}
        />
        <ProFormText width="md" name="phone" label="手机号" />
        <ProFormText.Password
          label="终端密码"
          rules={[
            {
              required: true,
              message: '请输入您的终端密码!',
            },
            {
              min: 6,
              message: '密码至少6位',
            },
          ]}
          width="md"
          name="terminalPassword"
          placeholder="请输入您的终端密码"
        />
      </ProForm>
    </ProCard>
  );
};

export default BasicInfoForm;
