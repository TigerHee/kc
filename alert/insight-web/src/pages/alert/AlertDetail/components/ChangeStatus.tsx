import { Card, Button, Form, Input, Select, message, Tag, Divider, Space } from 'antd';
import { useMemo } from 'react';
import type { FormProps } from 'antd';
import { API } from 'types';
import { useRequest } from 'ahooks';
import { changeStatus, changeAlertData } from '@/services/alert';

type Props = {
  data: API.AlertItem;
  statusData: API.AlertStatusList;
  refreshList: () => void;
};

type FieldType = {
  status: string;
  remark: string;
};

export default ({ data, statusData, refreshList }: Props) => {
  const [form] = Form.useForm<FieldType>();
  const { _id, status, finishData } = data;

  // 是否可以点处理完成
  const isCanFinish = useMemo(() => {
    return statusData?.find((i) => i.value === status)?.isCanFinish;
  }, [status, statusData]);

  // 设置响应时间
  useRequest(() => changeAlertData({ type: 'view', _id }), {
    ready: Boolean(_id && !data?.viewData?.email),
    onSuccess: (res) => {
      if (res.success) {
        refreshList();
      }
    },
  });

  // 处理完成
  const { loading: finishLoading, run: runFinish } = useRequest(
    (isReset?: boolean) => changeAlertData({ type: 'finish', _id, isReset }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.success) {
          message.success('修改成功');
          refreshList();
        }
      },
    },
  );

  // 修改状态
  const { loading, run } = useRequest(changeStatus, {
    manual: true,
    onSuccess: (res) => {
      if (res.success) {
        message.success('修改成功');
        refreshList();
        form.resetFields();
      }
    },
  });

  const onSubmitStatus: FormProps<FieldType>['onFinish'] = (values) => {
    const params = { ...values, _id };
    run(params);
  };

  const onSubmitStatusFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (finishData?.email) {
    return (
      <Space>
        <Tag color="success">处理完成</Tag>
        <Button onClick={() => runFinish(true)} loading={finishLoading} type="dashed">
          重启
        </Button>
      </Space>
    );
  }

  const statusList = (statusData || []).filter((i) => i.value !== '1');

  return (
    <Card title="状态修改" bordered={false}>
      {isCanFinish && (
        <>
          <Button onClick={() => runFinish(false)} loading={finishLoading} type="primary">
            处理完成
          </Button>
          <Divider />
        </>
      )}

      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onSubmitStatus}
        onFinishFailed={onSubmitStatusFailed}
        autoComplete="off"
        style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}
        form={form}
      >
        <Form.Item<FieldType>
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select style={{ width: 240 }} options={statusList} />
        </Form.Item>

        <Form.Item<FieldType> label="备注" name="remark" rules={[]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label={null}>
          <Button loading={loading} htmlType="submit">
            修改状态
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
