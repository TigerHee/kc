import { getComplianceReportList } from '@/services/compliance';
import { PageContainer, ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Badge, Button } from 'antd';
import { ComplianceAPI } from 'types/compliance';
import { history } from '@umijs/max';

const ComplianceReport: React.FC = () => {
  const columns: ProColumns<ComplianceAPI.ComplianceAtomicReportItem>[] = [
    {
      title: '报告ID',
      dataIndex: '_id',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      copyable: true,
      ellipsis: true,
      width: 200,
    },
    {
      title: '扫描范围',
      dataIndex: 'scanParams',
      align: 'left',
      width: 400,
      hideInSearch: true,
      renderText: (item: string) => {
        const data = JSON.parse(item);
        const { countryCode, scanRepos, fileScope } = data;
        return (
          <ProDescriptions column={1}>
            <ProDescriptions.Item label="扫描站点" span={1}>
              <div>
                {scanRepos && Array.isArray(scanRepos)
                  ? scanRepos.map((repo) => <Badge color="green" count={repo} key={repo}></Badge>)
                  : '-'}
              </div>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="扫描国家" span={1}>
              <div>
                {countryCode.all && Array.isArray(countryCode.all)
                  ? countryCode.all.map((country: string) => (
                      <Badge color="geekblue" count={country} key={country}></Badge>
                    ))
                  : '-'}
              </div>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="排除国家" span={1}>
              <div>
                {countryCode.except && Array.isArray(countryCode.except)
                  ? countryCode.except.map((country: string) => (
                      <Badge color="red" count={country} key={country}></Badge>
                    ))
                  : '-'}
              </div>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="文件后缀" span={1}>
              <div>
                {fileScope?.suffix && Array.isArray(fileScope.suffix)
                  ? fileScope.suffix.map((suffix: string) => (
                      <Badge color="blue" count={suffix} key={suffix}></Badge>
                    ))
                  : '-'}
              </div>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="忽略文件" span={1}>
              <div>
                {fileScope?.ignore && JSON.stringify(fileScope.ignore) !== '{}'
                  ? Object.entries(fileScope.ignore).map(([key, value]) => (
                      <div key={key}>
                        <Badge color="#faad14" count={key}></Badge>
                        {value && Array.isArray(value)
                          ? value.map((item: string) => (
                              <Badge color="gray" count={item} key={item}></Badge>
                            ))
                          : '-'}
                      </div>
                    ))
                  : '-'}
              </div>
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      valueType: 'text',
      width: 80,
      hideInSearch: true,
      align: 'center',
      render: (text) => {
        return <Badge color="primary">{text}</Badge>;
      },
    },
    {
      title: '扫描时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 160,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      width: 120,
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      renderText: (_, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                history.push(`/report/compliance/detail/${record._id}`);
              }}
            >
              报告详情
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable
          headerTitle="扫描报告"
          rowKey="_id"
          columns={columns}
          expandable={{
            fixed: 'left',
          }}
          search={{
            defaultCollapsed: false,
          }}
          request={async (params) => {
            console.log('request.params', params);
            const res = await getComplianceReportList(params);
            return {
              success: true,
              data: res.list,
              total: res.total,
            };
          }}
        />
      </PageContainer>
    </>
  );
};

export default ComplianceReport;
