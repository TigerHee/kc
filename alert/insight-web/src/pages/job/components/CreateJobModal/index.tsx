import { triggerImmediate, triggerInterval, triggerSchedule } from '@/services/jobs';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Input, Modal, Select, Space, Switch, notification } from 'antd';
import React, { useEffect } from 'react';
import { API } from 'types';
interface CreateJobModalProps {
  visible: boolean;
  jobDefine: API.DefineItem[];
  initialValues?: CreateModalFieldType;
  onSucceed: () => void;
  onClose: () => void;
}

export type CreateModalFieldType = {
  job: string;
  type: string;
  cron?: string;
  interval?: string;
  payload?: Record<string, any>[] | string;
};

const CreateJobModal: React.FC<CreateJobModalProps> = (props) => {
  const { visible, onClose, onSucceed, initialValues } = props;
  const [form] = Form.useForm<CreateModalFieldType>();
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [payloadEditMode, setPayloadEditMode] = React.useState<boolean>(false);

  const handleClose = () => {
    setSelectedType('');
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (initialValues?.type) {
      setSelectedType(initialValues.type);
    }
  }, [initialValues?.type]);

  const handleChangePayloadEditMode = (checked: boolean) => {
    form.setFieldValue('payload', undefined);
    setPayloadEditMode(checked);
  };

  const onFinish: FormProps<CreateModalFieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    let _payload: Record<string, any> = {};
    if (payloadEditMode) {
      _payload = ((values.payload as []) || [])?.reduce(
        (acc: { [x: string]: any }, cur: { key: string | number; value: any }) => {
          acc[cur.key] = cur.value;
          return acc;
        },
        {},
      );
    } else {
      _payload = JSON.parse((values?.payload as string) ?? '{}');
    }
    switch (values.type) {
      case 'immediate':
        triggerImmediate({
          name: values.job,
          payload: _payload,
        }).then(() => {
          notification.success({
            message: '立即任务',
            description: values.job + ' 任务创建成功',
          });
          onSucceed();
          handleClose();
        });
        break;
      case 'interval':
        triggerInterval({
          name: values.job,
          interval: values.interval!,
          payload: _payload,
        }).then(() => {
          onSucceed();
          notification.success({
            message: '周期任务',
            description: values.job + ' 任务创建成功',
          });
          handleClose();
        });
        break;
      case 'schedule':
        triggerSchedule({
          name: values.job,
          cron: values.cron!,
          payload: _payload,
        }).then(() => {
          onSucceed();
          notification.success({
            message: '计划任务',
            description: values.job + ' 任务创建成功',
          });
          handleClose();
        });
    }
  };

  const onFinishFailed: FormProps<CreateModalFieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      footer={null}
      title="创建调度"
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 700, paddingTop: 20 }}
        labelAlign="left"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="horizontal"
      >
        <Form.Item<CreateModalFieldType> label="任务" name="job" rules={[{ required: true }]}>
          <Select
            placeholder="请选择任务"
            options={props.jobDefine.map((item) => ({
              label: item.desc,
              value: item.name,
            }))}
          />
        </Form.Item>

        <Form.Item<CreateModalFieldType> label="调度方式" name="type" rules={[{ required: true }]}>
          <Select
            placeholder="请选择调度方式"
            options={[
              { label: '立即任务', value: 'immediate' },
              { label: '周期任务', value: 'interval' },
              { label: '计划任务', value: 'schedule' },
            ]}
            onChange={(value) => {
              form.setFieldsValue({ type: value });
              setSelectedType(value);
            }}
          />
        </Form.Item>

        {selectedType === 'interval' && (
          <Form.Item<CreateModalFieldType>
            label="调度周期"
            name="interval"
            rules={[{ required: true }]}
          >
            <Input placeholder="输入调度周期" />
          </Form.Item>
        )}

        {selectedType === 'schedule' && (
          <Form.Item<CreateModalFieldType>
            label="调度时间"
            name="cron"
            rules={[{ required: true }]}
          >
            <Input placeholder="输入调度时间" />
          </Form.Item>
        )}

        <Switch
          checkedChildren="表单模式"
          unCheckedChildren="JSON模式"
          value={payloadEditMode}
          defaultChecked
          onChange={handleChangePayloadEditMode}
        />
        <Form.Item label="数据" required>
          {payloadEditMode ? (
            <Form.List name="payload">
              {(fields, { add, remove }) => {
                if (!payloadEditMode) {
                  return (
                    <Form.Item>
                      <Input.TextArea
                        rows={10}
                        autoSize={{ minRows: 10, maxRows: 30 }}
                        placeholder="请输入JSON格式的数据"
                        style={{ height: 120 }}
                      />
                    </Form.Item>
                  );
                }
                return (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'key']}
                          rules={[{ required: true, message: '输入键' }]}
                        >
                          <Input placeholder="key" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          rules={[{ required: true, message: '输入值' }]}
                        >
                          <Input placeholder="value" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        增加字段
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>
          ) : (
            <Form.Item name="payload" required>
              <Input.TextArea
                rows={10}
                autoSize={{ minRows: 10, maxRows: 30 }}
                placeholder="请输入JSON格式的数据"
                style={{ height: 120 }}
              />
            </Form.Item>
          )}
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            创建调度
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateJobModal;
