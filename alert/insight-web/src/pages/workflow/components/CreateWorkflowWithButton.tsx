import { createWorkflow } from '@/services/workflow';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Input, Select, Space, message } from 'antd';
import React from 'react';
import { API } from 'types';

interface CreateWorkflowWithButtonProps {
  onSuccess: () => void;
  jobDefine: API.DefineItem[];
}
// interface CreateWorkflowWithButtonRefs {

// }
export const CreateWorkflowWithButton: React.FC<CreateWorkflowWithButtonProps> = ({
  onSuccess,
  jobDefine,
}) => {
  const [form] = Form.useForm<API.WorkflowItem>();

  return (
    <ModalForm<API.WorkflowItem>
      title="新建工作流"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          创建工作流
        </Button>
      }
      submitter={{
        render: (props) => {
          return [
            <Button key="cancel" onClick={() => props.reset()}>
              重置
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                props.submit();
              }}
            >
              提交
            </Button>,
          ];
        },
      }}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values);
        const nodes = values.node as unknown as { key: string }[];
        const node = nodes.map((item) => ({
          name: item.key,
          desc: jobDefine.find((job) => job.name === item.key)?.desc || '',
        }));
        const data = {
          ...values,
          node,
        };
        try {
          await createWorkflow(data);
          message.success('创建成功');
          onSuccess();
          return true;
        } catch (error) {
          console.log('error', error);
          return false;
        }
      }}
    >
      <Form.Item
        label="工作流名称"
        name="name"
        required
        rules={[{ required: true, message: '请输入名称' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        label="工作流描述"
        name="desc"
        required
        rules={[{ required: true, message: '清楚入描述' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="范围" required>
        <Select
          style={{ width: 350 }}
          defaultValue="project"
          disabled
          placeholder="请选择范围"
          options={[{ value: 'project', label: '项目' }]}
        />
      </Form.Item>
      <Form.Item label="节点" required>
        <Form.List name="node">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                    rules={[{ required: true, message: '请选择节点' }]}
                  >
                    <Select
                      style={{ width: 350 }}
                      // popupMatchSelectWidth={500}
                      options={jobDefine.map((item) => ({
                        label: item.desc,
                        value: item.name,
                      }))}
                      placeholder="请选择节点"
                    />
                  </Form.Item>
                  <Button danger onClick={() => remove(name)} icon={<MinusOutlined />}></Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  增加节点
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    </ModalForm>
  );
};
