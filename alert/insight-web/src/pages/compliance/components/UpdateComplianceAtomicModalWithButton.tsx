import { updateComplianceAtomic } from '@/services/compliance';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';
import { ComplianceAPI } from 'types/compliance';

interface UpdateComplianceAtomicModalWithButtonProps {
  id: string;
  values: ComplianceAPI.ComplianceAtomicItem;
  onSuccess: () => void;
}

const UpdateComplianceAtomicModalWithButton: React.FC<
  UpdateComplianceAtomicModalWithButtonProps
> = (props) => {
  const { onSuccess, values, id } = props;
  const [form] = Form.useForm();
  const initialValues = values;
  return (
    <>
      <ModalForm
        title="编辑代码扫描信息"
        form={form}
        autoFocusFirstInput
        initialValues={initialValues}
        modalProps={{
          destroyOnClose: true,
        }}
        submitTimeout={2000}
        trigger={<Button type="primary">编辑</Button>}
        onFinish={async (values) => {
          console.log(values);
          try {
            await updateComplianceAtomic(id, values);
            onSuccess();
            form.resetFields();
            return true;
          } catch (error) {
            form.setFieldsValue(initialValues);
            return false;
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            form.resetFields();
          } else {
            form.setFieldsValue(initialValues);
          }
        }}
      >
        <Form.Item label="合规中台配置的key" name="spm">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="代码/功能的备注" name="comment">
          <Input placeholder="请输入" />
        </Form.Item>
      </ModalForm>
    </>
  );
};

export default UpdateComplianceAtomicModalWithButton;
