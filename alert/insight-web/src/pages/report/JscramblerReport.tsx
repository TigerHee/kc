import { getJscramblerReport } from '@/services/report';
import { getReposGroup, getReposOptions } from '@/services/repos';
import { PageContainer, ProColumns, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Collapse } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';
import { Common } from 'types/common';

const JscramblerReport: React.FC = () => {
  const [repoOptions, setRepoOptions] = useState<Common.ReposOptionItem[]>([]);
  const [groupOptions, setGroupOptions] = useState<Common.SelectOptionItem[]>([]);
  const columns: ProColumns<API.JscramblerReportItem>[] = [
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
      title: '仓库',
      dataIndex: 'repo',
      valueType: 'text',
      align: 'center',
      valueEnum: repoOptions.reduce((prev, curr) => {
        Object.assign(prev, { [curr.value]: { text: curr.label } });
        return prev;
      }, {}),
      width: 220,
    },
    {
      title: '分支',
      dataIndex: 'branch',
      valueType: 'text',
      align: 'center',
      width: 220,
    },
    {
      title: '分组',
      dataIndex: 'slug',
      valueType: 'text',
      align: 'center',
      width: 220,
      valueEnum: groupOptions.reduce((prev, curr) => {
        Object.assign(prev, { [curr.value]: { text: curr.label } });
        return prev;
      }, {}),
    },
    {
      title: '扫描结果',
      dataIndex: 'config',
      align: 'left',
      width: 400,
      hideInSearch: true,
      render: (config) => {
        return (
          <Collapse
            items={[
              {
                key: '1',
                label: '结果详情',
                children: (
                  <ProDescriptions column={1}>
                    <ProDescriptions.Item valueType="jsonCode">
                      {JSON.stringify(config, null, 2)}
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
      fixed: 'right',
    },
  ];

  useEffect(() => {
    getReposOptions().then((res) => {
      setRepoOptions(res);
    });
    getReposGroup().then((res) => {
      setGroupOptions(res);
    });
  }, []);

  return (
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
          const res = await getJscramblerReport(params);
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

export default JscramblerReport;
