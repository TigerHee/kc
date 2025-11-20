import { createMustReadWiki } from '@/services/wikis';
import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';

interface CreateMustReadWikiModalWithButtonProps {
  onSuccess: () => void;
}

export const CreateMustReadWikiModalWithButton: React.FC<
  CreateMustReadWikiModalWithButtonProps
> = ({ onSuccess }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="新增必读文档"
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      trigger={<Button icon={<FolderAddOutlined />}>新增文档</Button>}
      onFinish={async (values) => {
        console.log('values', values);
        try {
          await createMustReadWiki({
            ...values,
            pageId: Number(values.pageId),
          });
          onSuccess();
          form.resetFields();
          return true;
        } catch (error) {}
      }}
    >
      <Form.Item
        label="ID"
        name="pageId"
        required
        layout="horizontal"
        rules={[{ required: true, message: '文档ID是必填的' }]}
      >
        <Input type="number" placeholder="请输入文档ID" />
      </Form.Item>
    </ModalForm>
  );
};
