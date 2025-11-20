import { updateRepo } from '@/services/repos';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Select } from 'antd';
import { API } from 'types';
import { Common } from 'types/common';

interface UpdateRepoModalWithButtonProps {
  onSuccess: () => void;
  data: API.ReposItem;
  groupOptions: Common.SelectOptionItem[];
}

export const UpdateRepoModalWithButton: React.FC<UpdateRepoModalWithButtonProps> = (props) => {
  const { onSuccess, data, groupOptions } = props;
  const [form] = Form.useForm();

  const initialValues = {
    ...data,
  };
  return (
    <ModalForm
      title="编辑仓库信息"
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      initialValues={initialValues}
      trigger={<Button icon={<EditOutlined />}>编辑</Button>}
      onFinish={async (values) => {
        console.log(values);
        const _data = {
          ...values,
          owner: values?.owner ? values?.owner?.[0] : null,
          routes: values?.routes?.map((item: { key: string }) => item.key) ?? [],
        };
        console.log('_data', _data);
        try {
          await updateRepo(data._id, _data);
          onSuccess();
          form.resetFields();
          return true;
        } catch (error) {}
      }}
    >
      <Form.Item
        label="仓库分组"
        name="group"
        required
        rules={[{ required: true, message: '请选择仓库分组' }]}
      >
        <Select options={groupOptions} placeholder="选择仓库分组" />
      </Form.Item>
    </ModalForm>
  );
};
