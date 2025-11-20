import { createSystemBreakdownAnnouncement } from '@/services/announcement';
import { NotificationOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, DatePicker, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface CreateSystemBreakdownModalWithButtonProps {
  onSuccess: () => void;
}

export const CreateSystemBreakdownModalWithButton: React.FC<
  CreateSystemBreakdownModalWithButtonProps
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
          await createSystemBreakdownAnnouncement(values);
          form.resetFields();
          onSuccess();
          return true;
        } catch (error) {}
      }}
    >
      <Form.Item
        label="开始时间"
        name="startAt"
        rules={[{ required: true, message: '请输入开始时间' }]}
        required
      >
        <DatePicker placeholder="请输入开始时间" showTime />
      </Form.Item>

      <Form.Item
        label="完成时间"
        name="finishAt"
        rules={[{ required: true, message: '请输入完成时间' }]}
        required
      >
        <DatePicker placeholder="请输入完成时间" showTime />
      </Form.Item>

      <Form.Item
        label="停机原因"
        name="content"
        required
        rules={[{ required: true, message: '请输入停机原因' }]}
      >
        <TextArea placeholder="请输入停机原因" autoSize={{ minRows: 6, maxRows: 12 }} />
      </Form.Item>
    </ModalForm>
  );
};
