import { createFeatureAnnouncement } from '@/services/announcement';
import { NotificationOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface CreateFeatureUpdateModalWithButtonProps {
  onSuccess: () => void;
}

export const CreateFeatureUpdateModalWithButton: React.FC<
  CreateFeatureUpdateModalWithButtonProps
> = ({ onSuccess }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="发布公告"
      form={form}
      autoFocusFirstInput
      clearOnDestroy
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      trigger={<Button icon={<NotificationOutlined />}>发布公告</Button>}
      initialValues={{}}
      onFinish={async (values) => {
        try {
          await createFeatureAnnouncement(values);
          form.resetFields();
          onSuccess();
          return true;
        } catch (error) {}
      }}
    >
      <Form.Item label="文档链接" name="manualsUrl" rules={[{ message: '请输入文档链接' }]}>
        <Input placeholder="请输入文档链接" />
      </Form.Item>

      <Form.Item label="功能链接" name="featureUrl" rules={[{ message: '请输入功能链接' }]}>
        <Input placeholder="请输入功能链接" />
      </Form.Item>

      <Form.Item
        label="功能描述"
        name="feature"
        required
        rules={[{ required: true, message: '请输入功能描述' }]}
      >
        <TextArea placeholder="请输入功能描述" autoSize={{ minRows: 6, maxRows: 12 }} />
      </Form.Item>
    </ModalForm>
  );
};
