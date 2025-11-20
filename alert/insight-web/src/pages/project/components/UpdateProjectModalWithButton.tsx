import TreeSelectSchedule from '@/components/TreeSelectSchedule';
import { WorkflowRadio } from '@/components/WorkflowRadio';
import { updateProject } from '@/services/projects';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Alert, Button, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { API } from 'types';
import { Common } from 'types/common';

interface UpdateProjectModalWithButtonProps {
  userOptions: Common.UserSelectOptionItem[];
  workflowOptions: Common.WorkflowOptionItem[];
  onSuccess: () => void;
  repos: API.ReposItem[];
  data: API.ProjectsItem;
  simply?: boolean;
}

export const UpdateProjectModalWithButton: React.FC<UpdateProjectModalWithButtonProps> = (
  props,
) => {
  const { onSuccess, simply = false, data, repos, workflowOptions, userOptions } = props;
  console.log('data', data);
  const workflowIds = (data?.workflowSchedule || [])
    .map((schedule) => schedule?.workflow?._id)
    .filter(Boolean);
  const [form] = Form.useForm();
  const [workflowValue, setWorkflowValue] = useState<string[]>(workflowIds);
  const initialValues = {
    name: data.name,
    owner: data?.owner?._id,
    repos: data?.repos?._id,
    accessibleLink: data?.accessibleLink,
    workflow: workflowIds,
    schedule: data?.workflowSchedule?.reduce((acc, cur) => {
      if (cur.interval) {
        Object.assign(acc, {
          [cur.workflow._id]: cur.interval,
        });
      }
      return acc;
    }, {}),
  };

  return (
    <ModalForm
      form={form}
      title="编辑项目"
      submitTimeout={2000}
      autoFocusFirstInput
      clearOnDestroy
      modalProps={{
        destroyOnClose: true,
      }}
      trigger={<Button icon={<EditOutlined />}>{!simply && '编辑项目'}</Button>}
      onFinish={async (values) => {
        console.log('values', values);
        try {
          await updateProject(data._id, values);
          form.resetFields();
          onSuccess();
          return true;
        } catch (error) {
          console.log('onFinish.error', error);
          return false;
        }
      }}
      onOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          setWorkflowValue([]);
        } else {
          form.setFieldsValue(initialValues);
          setWorkflowValue(initialValues.workflow as string[]);
        }
      }}
      initialValues={initialValues}
    >
      <Form.Item
        label="项目名称"
        name="name"
        required
        rules={[{ required: true, message: '请输入项目名称' }]}
      >
        <Input disabled placeholder="请输入" />
      </Form.Item>
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
      <Form.Item label="关联工作流" name="workflow" required>
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
