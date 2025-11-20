import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { saveAlertGroup } from '@/services/alert';

type FieldType = {
  name: string;
};

type AlertGroupItem = {
  _id: string;
  name: string;
};

type Props = {
  refreshList: () => void;
  onCancel: () => void;
  open: boolean;
  curItem: AlertGroupItem | null;
};

const AddModal: React.FC<Props> = ({ refreshList, open, onCancel, curItem }) => {
  const [form] = Form.useForm<FieldType>();

  const isEdit = !!curItem?._id;

  useEffect(() => {
    if (curItem) {
      form.setFieldsValue({ name: curItem.name });
    } else {
      form.resetFields();
    }
  }, [curItem, form]);

  const onSubmitStatus: FormProps<FieldType>['onFinish'] = (values) => {
    const params = isEdit
      ? { name: values.name.trim(), _id: curItem!._id }
      : { name: values.name.trim() };
    saveAlertGroup(params).then(() => {
      refreshList();
      onCancel();
    });
  };

  const onSubmitStatusFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title={isEdit ? '编辑告警组' : '新增告警组'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        name="alertGroupForm"
        onFinish={onSubmitStatus}
        onFinishFailed={onSubmitStatusFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="告警组名称"
          name="name"
          rules={[{ required: true, message: '请输入告警组名称' }]}
        >
          <Input size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
