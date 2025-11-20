import { getSafebrowsingReport } from '@/services/report';
import { PageContainer, ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Collapse } from 'antd';
import { API } from 'types';

const SafebrowsingReport: React.FC = () => {
  const columns: ProColumns<API.SafebrowsingItem>[] = [
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
      width: 200,
      onCell: undefined,
      render: (_, record) => (
        <a href={`https://${record.threat.url}`} target="_blank" rel="noreferrer">
          {record.threat.url}
        </a>
      ),
    },

    {
      title: '威胁类型',
      dataIndex: 'threatType',
      valueType: 'select',
      align: 'center',
      request: async () => [
        { label: '未知类型', value: 'THREAT_TYPE_UNSPECIFIED' },
        { label: '恶意软件', value: 'MALWARE' },
        { label: '社会工程学', value: 'SOCIAL_ENGINEERING' },
        { label: '垃圾软件', value: 'UNWANTED_SOFTWARE' },
        { label: '可能有害应用', value: 'POTENTIALLY_HARMFUL_APPLICATION' },
      ],
      width: 180,
    },
    {
      title: '威胁条目类型',
      hideInSearch: true,
      dataIndex: 'threatEntryType',
      valueType: 'text',
      align: 'center',
      width: 160,
    },
    {
      title: '扫描结果',
      dataIndex: 'data',
      align: 'left',
      width: 360,
      hideInSearch: true,
      onCell: undefined,
      render: (_, record) => {
        const {
          cacheDuration,
          platformType,
          threat,
          threatEntryMetadata,
          threatEntryType,
          threatType,
        } = record;
        const originData = {
          platformType,
          threat,
          threatEntryMetadata,
          threatEntryType,
          threatType,
          cacheDuration,
        };
        return (
          <Collapse
            items={[
              {
                key: '1',
                label: '结果详情',
                children: (
                  <ProDescriptions column={1}>
                    <ProDescriptions.Item valueType="jsonCode">
                      {JSON.stringify(originData, null, 2)}
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
      title: '平台类型',
      dataIndex: 'platformType',
      valueType: 'select',
      align: 'left',
      width: 200,
      request: async () => [
        { label: '未知平台', value: 'PLATFORM_TYPE_UNSPECIFIED' },
        { label: 'Windows 构成威胁', value: 'WINDOWS' },
        { label: 'Linux 构成威胁', value: 'LINUX' },
        { label: 'Android 构成威胁', value: 'ANDROID' },
        { label: 'macOS (OS X) 构成威胁', value: 'OSX' },
        { label: 'iOS 构成威胁', value: 'IOS' },
        { label: '至少一个指定平台构成威胁', value: 'ANY_PLATFORM' },
        { label: '所有定义的平台构成威胁', value: 'ALL_PLATFORMS' },
        { label: 'Chrome 构成威胁', value: 'CHROME' },
      ],
    },
    // {
    //   title: '威胁条目元数据',
    //   dataIndex: 'threatEntryMetadata',
    //   valueType: 'text',
    //   align: 'center',
    //   width: 140,
    // },
    {
      title: '缓存时间',
      hideInSearch: true,
      dataIndex: 'cacheDuration',
      valueType: 'text',
      align: 'center',
      width: 160,
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
          const res = await getSafebrowsingReport(params);
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
export default SafebrowsingReport;
