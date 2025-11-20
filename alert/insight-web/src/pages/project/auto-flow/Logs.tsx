import { getJobDefine } from '@/services/jobs';
import { getProjectDetailLogs } from '@/services/projects';
import { ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';

interface AutoFlowLogsProps {
  project: string;
}
const AutoFlowLogs: React.FC<AutoFlowLogsProps> = ({ project }) => {
  const [jobDefine, setJobDefine] = useState<API.DefineItem[]>([]);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<API.LogItem>();

  useEffect(() => {
    getJobDefine().then((res) => {
      setJobDefine(res);
    });
  }, []);

  const JobDefineEnum = jobDefine.reduce(
    (acc, cur) => {
      const res = {
        ...acc,
        [cur.name]: {
          text: cur.desc,
          status: cur.name.split(':')[0] === 'SYSTEM' ? 'warning' : 'processing',
        },
      };
      return res;
    },
    {} as { [key: string]: { text: string } },
  );

  const columns: ProColumns<API.LogItem>[] = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 200,
      fixed: 'left',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      valueType: 'text',
      width: 300,
      valueEnum: JobDefineEnum,
    },
    {
      title: '任务ID',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '执行数据',
      width: 100,
      renderText: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setCurrentRow(record);
              setIsDataModalOpen(true);
            }}
          >
            数据
          </Button>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      align: 'center',
      fixed: 'right',
      width: 140,
      valueEnum: {
        create: { text: '创建', status: 'Processing' },
        complete: { text: '完成', status: 'Success' },
        success: { text: '成功', status: 'Success' },
        error: { text: '错误', status: 'Error' },
        fail: { text: '失败', status: 'Error' },
        start: { text: '开始', status: 'Processing' },
        disable: { text: '手动禁用', status: 'Warning' },
        enable: { text: '手动启用', status: 'Warning' },
        remove: { text: '手动删除', status: 'Warning' },
        cancel: { text: '手动取消', status: 'Warning' },
        'manual-complete': { text: '手动完成', status: 'Warning' },
      },
    },
  ];

  const handleDataModalOk = () => {
    setIsDataModalOpen(false);
    setCurrentRow(undefined);
  };

  const handleDataModalCancel = () => {
    setIsDataModalOpen(false);
    setCurrentRow(undefined);
  };

  return (
    <>
      <ProTable
        rowKey="_id"
        columns={columns}
        expandable={{
          fixed: 'left',
        }}
        headerTitle={false}
        search={false}
        request={async (params) => {
          const res = await getProjectDetailLogs(project, params);
          return {
            data: res.list,
            total: res.total,
            success: true,
          };
        }}
      />
      <Modal
        title="详细数据"
        open={isDataModalOpen}
        onOk={handleDataModalOk}
        onCancel={handleDataModalCancel}
        width={800}
        height={600}
      >
        <ProDescriptions
          column={1}
          title={null}
          style={{
            maxHeight: 600,
            overflowY: 'auto',
          }}
        >
          <ProDescriptions.Item label={null} valueType="jsonCode">
            {JSON.stringify((currentRow?.jobId as API.JobItem)?.data?.payload ?? {}, null, 2)}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Modal>
    </>
  );
};

export default AutoFlowLogs;
