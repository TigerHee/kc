// import { WorkflowRadio } from '@/components/WorkflowRadio';
import { createTask } from '@/services/tasks';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Input, Tooltip, message } from 'antd';
import { generate } from 'random-words';

interface CreateTaskModalWithButtonProps {
  onSuccess: () => void;
}

export const CreateTaskModalWithButton: React.FC<CreateTaskModalWithButtonProps> = (props) => {
  const { onSuccess } = props;
  const [form] = Form.useForm();

  const randomWords = () => {
    const random = generate({
      exactly: 1,
      wordsPerString: 2,
      separator: '-',
      maxLength: 6,
      minLength: 4,
    })[0];
    return `t-${random}`;
  };

  const initialValues = {
    taskId: randomWords(),
  };

  return (
    <ModalForm
      title="创建任务"
      trigger={
        <Button
          type="primary"
          onClick={() => {
            form.setFieldsValue({ taskId: randomWords() });
          }}
        >
          <PlusOutlined />
          创建任务
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
          await createTask(values);
          message.success('创建成功');
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
        <Input
          placeholder="请输入任务ID"
          suffix={
            <Tooltip title="随机任务ID">
              <ReloadOutlined
                style={{ color: 'rgba(0,0,0,.45)' }}
                onClick={() => {
                  form.setFieldsValue({ taskId: randomWords() });
                }}
              />
            </Tooltip>
          }
        />
      </Form.Item>
      <Form.Item
        label="任务名称"
        name="taskName"
        required
        rules={[{ required: true, message: '请输入任务名称' }]}
      >
        <Input placeholder="请输入任务名称" />
      </Form.Item>
      <Form.Item
        label="Lark方案"
        tooltip="Lark Wiki方案唯一值，用于唯一标识方案；例如：https://klarkchat.sg.larksuite.com/wiki/XiYawh9Z8iiipzkInROlRqHYg2g 的值为 XiYawh9Z8iiipzkInROlRqHYg2g"
        name="wikiPageId"
        rules={[{ required: true, message: '请输入lark技术方案wiki的id' }]}
      >
        <Input placeholder="请输入技术方案id" style={{ width: '100%' }} />
      </Form.Item>
    </ModalForm>
  );
};
