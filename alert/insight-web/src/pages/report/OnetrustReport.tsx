import { getOneTrustReport } from '@/services/report';
import { PageContainer, ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Badge, Collapse } from 'antd';
import { API } from 'types';

const OnetrustReport: React.FC = () => {
  const columns: ProColumns<API.OneTrustReportItem>[] = [
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
      dataIndex: 'domain',
      valueType: 'text',
      align: 'center',
      hideInSearch: true,
      width: 220,
    },
    {
      title: '扫描结果',
      dataIndex: 'data',
      align: 'left',
      width: 400,
      hideInSearch: true,
      onCell: undefined,
      renderText: (data) => {
        return (
          <Collapse
            items={[
              {
                key: '1',
                label: (
                  <>
                    Cookie条目
                    <Badge
                      className="site-badge-count-109"
                      count={data?.length ?? 0}
                      style={{ backgroundColor: '#01bc8d', marginLeft: 10 }}
                    />
                  </>
                ),
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
      },
    },
    {
      title: '扫描时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 220,
      hideInSearch: true,
      align: 'left',
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      valueType: 'text',
      hideInSearch: true,
      width: 220,
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
          const res = await getOneTrustReport(params);
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
export default OnetrustReport;
