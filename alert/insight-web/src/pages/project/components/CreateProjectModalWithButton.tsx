import TreeSelectSchedule from '@/components/TreeSelectSchedule';
import { WorkflowRadio } from '@/components/WorkflowRadio';
import { createProject } from '@/services/projects';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Alert, Button, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { API } from 'types';
import { Common } from 'types/common';

interface CreateProjectModalWithButtonProps {
  workflowOptions: Common.WorkflowOptionItem[];
  userOptions: Common.UserSelectOptionItem[];
  onSuccess: () => void;
  repos: API.ReposItem[];
}

export const CreateProjectModalWithButton: React.FC<CreateProjectModalWithButtonProps> = (
  props,
) => {
  const { onSuccess, repos, userOptions, workflowOptions } = props;
  const [form] = Form.useForm();
  const [workflowValue, setWorkflowValue] = useState<string[]>([]);

  return (
    <ModalForm
      title="新建项目"
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          创建项目
        </Button>
      }
      onFinish={async (values) => {
        console.log(values);
        try {
          await createProject(values);
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
          setWorkflowValue([]);
        } else {
          setWorkflowValue([]);
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
        label="关联仓库"
        name="repos"
        required
        rules={[{ required: true, message: '请选择关联仓库' }]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={repos.map((repo) => ({ label: repo.name, value: repo._id }))}
          placeholder="请选择关联仓库"
        />
      </Form.Item>
      <Form.Item
        label="可访问链接"
        name="accessibleLink"
        tooltip="请填写不需要登录就可以访问的链接，需要能解析到 window.__KC_CRTS__"
      >
        <Input placeholder="请输入可访问链接" />
      </Form.Item>
      <Form.Item label="关联工作流" name="workflow">
        <WorkflowRadio
          multiple
          workflowOptions={workflowOptions}
          onChange={(values) => setWorkflowValue(values as string[])}
          value={workflowValue}
        />
      </Form.Item>

      {workflowValue.length > 0 && <Alert message="调度周期" style={{ marginBottom: 15 }} />}

      {workflowValue?.map((item: string) => {
        return (
          <Form.Item
            key={item}
            label={workflowOptions.find((workflow) => workflow.value === item)?.label}
            name={['schedule', item]}
            required
            rules={[{ required: true, message: '选择对应工作流的执行时间' }]}
          >
            <TreeSelectSchedule />
          </Form.Item>
        );
      })}
    </ModalForm>
  );
};
