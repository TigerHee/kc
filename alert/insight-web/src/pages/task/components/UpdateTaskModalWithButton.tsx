import { updateTask } from '@/services/tasks';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Input, Switch, message } from 'antd';
import { API } from 'types';

interface UpdateTaskModalWithButtonProps {
  onSuccess: () => void;
  data: API.TaskItem;
  size?: 'small' | 'middle' | 'large';
}

export const UpdateTaskModalWithButton: React.FC<UpdateTaskModalWithButtonProps> = (props) => {
  const { onSuccess, data, size = 'middle' } = props;
  const [form] = Form.useForm();

  const initialValues = {
    taskId: data.taskId,
    taskName: data.taskName,
    wikiPageId: data.wiki.pageId,
    status: data.status,
  };
  return (
    <ModalForm
      title="编辑任务信息"
      trigger={
        <Button size={size} color="primary" icon={<EditOutlined style={{ color: 'primary' }} />}>
          {/* 编辑 */}
        </Button>
      }
      form={form}
      initialValues={initialValues}
      submitter={{
        render: (props) => {
          return [
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
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values);
        console.log('values', values);
        try {
          await updateTask(data._id, values);
          message.success('更新成功');
          onSuccess();
          return true;
        } catch (error) {}
      }}
    >
      <Form.Item
        label="任务ID"
        name="taskId"
        required
        rules={[{ required: true, message: '请输入任务ID' }]}
      >
        <Input placeholder="请输入任务ID" disabled />
      </Form.Item>
      <Form.Item
        label="任务名称"
        name="taskName"
        required
        rules={[{ required: true, message: '请输入任务名称' }]}
      >
        <Input placeholder="请输入任务名称" />
      </Form.Item>
      {data.wikiCheckerVersion === 1 || data.wikiCheckerVersion === 2 ? (
        <Form.Item
          label="Wiki方案ID"
          name="wikiPageId"
          required
          rules={[{ required: true, message: '请输入方案ID' }]}
        >
          <Input placeholder="请输入方案ID" style={{ width: '100%' }} disabled />
        </Form.Item>
      ) : (
        <Form.Item
          label="Lark方案"
          tooltip="Lark Wiki方案唯一值，用于唯一标识方案；例如：https://klarkchat.sg.larksuite.com/wiki/XiYawh9Z8iiipzkInROlRqHYg2g 的值为 XiYawh9Z8iiipzkInROlRqHYg2g"
          name="wikiPageId"
          rules={[{ required: true, message: '请输入lark技术方案wiki的id' }]}
        >
          <Input placeholder="请输入lark技术方案wiki的id" style={{ width: '100%' }} disabled />
        </Form.Item>
      )}
      <Form.Item label="状态" name="status">
        <Switch checkedChildren="已完成" unCheckedChildren="进行中" />
      </Form.Item>
    </ModalForm>
  );
};
