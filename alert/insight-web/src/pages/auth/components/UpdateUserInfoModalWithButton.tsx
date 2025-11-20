import { updateUserInfo } from '@/services/user';
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Input, Select, Switch } from 'antd';
import { API } from 'types';

interface UpdateUserInfoModalWithButtonProps {
  onSuccess: () => void;
  data: API.UserItem;
}
export const UpdateUserInfoModalWithButton: React.FC<UpdateUserInfoModalWithButtonProps> = ({
  data,
  onSuccess,
}) => {
  const initialValues = data;
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="更新用户信息"
      form={form}
      autoFocusFirstInput
      clearOnDestroy
      modalProps={{
        destroyOnClose: true,
      }}
      initialValues={initialValues}
      submitTimeout={2000}
      trigger={<Button icon={<EditOutlined />}></Button>}
      onFinish={async (values) => {
        console.log(values);
        const _data = values;
        try {
          await updateUserInfo(data._id, _data);
          form.resetFields();
          onSuccess();
          return true;
        } catch (error) {}
      }}
      onOpenChange={(open) => {
        if (!open) {
          form.resetFields();
        } else {
          form.setFieldsValue(initialValues);
        }
      }}
    >
      <Form.Item
        label="用户名"
        name="name"
        required
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="邮箱"
        name="email"
        required
        rules={[{ required: true, message: '请输入邮箱' }]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.List name="bkEmail">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item label={`备用邮箱${index + 1}`} required={false} key={field.key}>
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入备用邮箱',
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="请输入备用邮箱地址" style={{ width: '60%' }} />
                </Form.Item>
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => remove(field.name)}
                  style={{ margin: '0 8px' }}
                />
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                增加备用邮箱
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item label="手机号码" name="phone">
        <Input placeholder="请输入手机号码" />
      </Form.Item>

      <Form.Item
        label="角色"
        name="role"
        required
        tooltip="不同角色的请求权限和菜单范围都不同，请谨慎选择"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select
          placeholder="请选择角色"
          options={[
            { label: '管理员', value: 'admin' },
            { label: '用户', value: 'user' },
          ]}
          maxCount={1}
        />
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          // console.log('getFieldValue', getFieldValue('prAuth'));
          const prAuth = getFieldValue('prAuth');
          if (prAuth?.status === false) {
            return (
              <>
                <Form.Item
                  label="PR权限"
                  name={['prAuth', 'status']}
                  required
                  tooltip="PR权限开启后, 用户将可以自行创建PR请求, 反之用户的PR请求将被直接拒绝"
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
                <Form.Item
                  label="拒绝原因"
                  name={['prAuth', 'rejectReason']}
                  required
                  rules={[{ required: true, message: '请输入拒绝原因' }]}
                >
                  <Input.TextArea placeholder="请输入拒绝PR权限说明" />
                </Form.Item>
              </>
            );
          } else {
            return (
              <Form.Item
                label="PR权限"
                name={['prAuth', 'status']}
                required
                tooltip="PR权限开启后, 用户将可以自行创建PR请求, 反之用户的PR请求将被直接拒绝"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            );
          }
        }}
      </Form.Item>
    </ModalForm>
  );
};
