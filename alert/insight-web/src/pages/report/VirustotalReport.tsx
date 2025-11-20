import { getVirustotalReport } from '@/services/report';
import { PageContainer, ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Collapse } from 'antd';
import { API } from 'types';

const VirustotalReport: React.FC = () => {
  const columns: ProColumns<API.VirustotalItem>[] = [
    {
      title: '报告ID',
      dataIndex: '_id',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      copyable: true,
      ellipsis: true,
      width: 140,
    },
    {
      title: '域名',
      dataIndex: 'id',
      valueType: 'text',
      align: 'center',
      width: 200,
      onCell: undefined,
      render: (url) => (
        <a href={`https://${url}`} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '恶意数量',
      hideInSearch: true,
      dataIndex: 'malicious',
      valueType: 'text',
      align: 'center',
      width: 160,
    },
    {
      title: '可疑数量',
      hideInSearch: true,
      dataIndex: 'suspicious',
      valueType: 'text',
      align: 'center',
      width: 160,
    },
    {
      title: '扫描结果',
      dataIndex: 'analysisResults',
      align: 'left',
      width: 300,
      hideInSearch: true,
      onCell: undefined,
      render: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          return (
            <Collapse
              items={[
                {
                  key: '1',
                  label: '结果详情',
                  children: (
                    <ProDescriptions column={1}>
                      <ProDescriptions.Item valueType="jsonCode">
                        {JSON.stringify(data, null, 2)}
                      </ProDescriptions.Item>
                    </ProDescriptions>
                  ),
                },
              ]}
            />
          );
        } else {
          return '无';
        }
      },
    },
    {
      title: '扫描时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      width: 220,
      hideInSearch: true,
      align: 'left',
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      valueType: 'text',
      width: 150,
      align: 'left',
      fixed: 'right',
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="扫描报告"
        rowKey="_id"
        columns={columns}
        expandable={{
          fixed: 'left',
        }}
        request={async (params) => {
          console.log('request.params', params);
          const res = await getVirustotalReport(params);
          return {
            data: res.list,
            success: true,
            total: res.total,
          };
        }}
      />
    </PageContainer>
  );
};
export default VirustotalReport;
