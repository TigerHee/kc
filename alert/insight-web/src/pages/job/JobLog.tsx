import { getJobDefine, getJobLog } from '@/services/jobs';
import { PageContainer, ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { API } from 'types';

const JobLog: React.FC = () => {
  const [jobDefine, setJobDefine] = useState<API.DefineItem[]>([]);

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
      title: '日志ID',
      dataIndex: '_id',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      width: 160,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '调度ID',
      dataIndex: 'jobId',
      fixed: 'left',
      ellipsis: true,
      copyable: true,
      width: 160,
    },
    {
      title: '任务',
      dataIndex: 'name',
      copyable: true,
      valueType: 'text',
      width: 300,
      valueEnum: JobDefineEnum,
    },
    {
      title: '执行数据',
      hideInSearch: true,
      hideInForm: true,
      hideInDescriptions: true,
      dataIndex: ['data'],
      align: 'left',
      width: 460,
      render: (data) => {
        return (
          <ProDescriptions column={1}>
            <ProDescriptions.Item valueType="jsonCode">
              {JSON.stringify(data, null, 2)}
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '错误信息',
      dataIndex: 'error',
      valueType: 'textarea',
      hideInSearch: true,
      width: 300,
    },
    {
      title: '执行时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 200,
      align: 'center',
    },
    {
      title: '执行结果',
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
  return (
    <div>
      <PageContainer
        header={{
          title: null,
        }}
      >
        <ProTable
          headerTitle="任务日志列表"
          rowKey="_id"
          request={async (params) => {
            const res = await getJobLog(params);
            return {
              data: res.list,
              success: true,
              total: res.total,
            };
          }}
          expandable={{
            fixed: 'right',
          }}
          search={{
            defaultCollapsed: false,
          }}
          columns={columns}
        />
      </PageContainer>
    </div>
  );
};
export default JobLog;
