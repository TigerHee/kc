import { SettingOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Checkbox, Form, Select } from 'antd';
import { API } from 'types';

interface SettingWorkflowWithButtonProps {
  data: API.WorkflowItem;
}
const SettingWorkflowWithButton: React.FC<SettingWorkflowWithButtonProps> = (props) => {
  const { data } = props;
  const [form] = Form.useForm<API.WorkflowItem>();
  const initialValues = {
    ...data,
    node: data.node.map((item) => ({ key: item.name })),
  };

  const scopeOptions = [
    {
      value: 'project',
      label: '项目',
    },
    {
      value: 'task',
      label: '任务',
    },
    {
      value: 'system',
      label: '系统',
    },
    {
      value: 'ci',
      label: '持续集成',
    },
  ];
  return (
    <>
      <ModalForm<API.WorkflowItem>
        title="配置工作流"
        form={form}
        initialValues={initialValues}
        trigger={
          <Button type="default" icon={<SettingOutlined key="setting" />}>
            配置
          </Button>
        }
        submitter={{
          render: (props) => {
            return [
              <Button
                key="submit"
                type="primary"
                disabled
                onClick={() => {
                  props.submit();
                }}
              >
                提交
              </Button>,
            ];
          },
        }}
      >
        <Form.Item label="应用范围" name="scope" required>
          <Checkbox.Group disabled options={scopeOptions} />
        </Form.Item>
        <Form.Item label="编辑模式" name="mode">
          <Select
            defaultValue="snapshoot"
            disabled
            options={[{ value: 'snapshoot', label: '快照模式' }]}
          />
        </Form.Item>
      </ModalForm>
    </>
  );
};

export default SettingWorkflowWithButton;
