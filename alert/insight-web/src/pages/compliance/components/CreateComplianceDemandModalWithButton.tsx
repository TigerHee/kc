import { createComplianceDemand } from '@/services/compliance';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Common } from 'types/common';

interface CreateComplianceDemandModalWithButtonProps {
  userOptions: Common.UserSelectOptionItem[];
  onSuccess: () => void;
}
const CreateComplianceDemandModalWithButton: React.FC<
  CreateComplianceDemandModalWithButtonProps
> = (props) => {
  const { onSuccess, userOptions } = props;
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="创建合规需求"
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          创建合规需求
        </Button>
      }
      onFinish={async (values) => {
        console.log(values);
        try {
          await createComplianceDemand(values);
          onSuccess();
          form.resetFields();
          return true;
        } catch (error) {
          return false;
        }
      }}
      onOpenChange={(open) => {
        if (!open) {
          form.resetFields();
        } else {
        }
      }}
    >
      <Form.Item
        label="负责人"
        name="owner"
        required
        rules={[{ required: true, message: '请选择负责人' }]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={userOptions}
          placeholder="请选择负责人"
          filterOption={(input, option) => {
            return ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase());
          }}
        />
      </Form.Item>

      <Form.Item
        label="需求标题"
        name="title"
        required
        rules={[{ required: true, message: '请输入项目名称' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        label="技术方案链接"
        name="schemeUrl"
        required
        rules={[{ required: true, message: '请输入技术方案链接' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        label="产品需求文档链接"
        name="prdUrl"
        required
        rules={[{ required: true, message: '请输入产品需求文档链接' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="巡检" name="patrol" tooltip="巡检的方案和说明">
        <TextArea placeholder="请输入" />
      </Form.Item>

      <Form.Item label="需求备注" tooltip="需求的额外说明内容" name="remark">
        <TextArea placeholder="请输入" />
      </Form.Item>

      <Form.Item label="上线时间" name="publicAt">
        <DatePicker placeholder="请选择" />
      </Form.Item>
    </ModalForm>
  );
};

export default CreateComplianceDemandModalWithButton;
