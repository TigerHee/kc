import { useEffect, useState } from 'react';
import { ComplianceAPI } from 'types/compliance';
import Template from './template';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Badge, Button, Segmented, Table } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import type { TableColumnsType } from 'antd';
import { getFileLink } from '@/utils/bitbucket';
import { CodeBlock } from '@/components/CodeBlock';

const ComplianceDetailV1: React.FC<{ data: ComplianceAPI.ComplianceAtomicReportItem }> = ({
  data,
}) => {
  const [tableTypeKey, setTableTypeKey] = useState<'adding' | 'deleting'>('adding');
  const [loading, setLoading] = useState(true);
  const [processedAddingItems, setProcessedAddingItems] = useState<
    ComplianceAPI.ComplianceAtomicItem[]
  >([]);
  const [processedDeletingItems, setProcessedDeletingItems] = useState<
    ComplianceAPI.ComplianceAtomicItem[]
  >([]);
  const [processedScanParams, setProcessedScanParams] = useState<{
    countryCode: {
      all: [];
      except: [];
    };
    scanRepos: [];
    fileScope: {
      suffix: [];
      ignore: {
        [key: string]: string[];
      };
    };
  }>();

  const columns: TableColumnsType<ComplianceAPI.ComplianceAtomicItem> = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      fixed: 'left',
    },
    {
      title: '代码',
      dataIndex: 'code',
      width: 360,
      render: (_, record) => {
        return (
          <div>
            <CodeBlock
              data={[
                {
                  lineNumber: record.line,
                  code: record.code,
                },
              ]}
              highlineRow={0}
            />
          </div>
        );
      },
    },
    {
      title: '仓库',
      dataIndex: 'repo',
      width: 140,
      // sorter: (a, b) => a.repo.localeCompare(b.repo),
    },
    {
      title: '文件',
      dataIndex: 'path',
      width: 120,
      // sorter: (a, b) => a.path.localeCompare(b.path),
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 140,
    },
    {
      title: 'spm',
      dataIndex: 'spm',
      width: 140,
      render: (text) => {
        if (text) {
          return text;
        } else {
          return '-';
        }
      },
    },
    {
      title: '注释',
      dataIndex: 'comment',
      width: 180,
      render: (text) => {
        if (text) {
          return text;
        } else {
          return '-';
        }
      },
    },
    {
      title: '代码仓库',
      width: 100,
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return (
          <a
            target="_blank"
            href={getFileLink(record.slug, record.repo, record.path, record.line)}
            rel="noreferrer"
          >
            #{record.line}
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    const handler = new Template(data).getHandler();
    setProcessedAddingItems(handler.getAddingItems());
    setProcessedDeletingItems(handler.getDeletingItems());
    setProcessedScanParams(handler.getScanParams());
    setLoading(false);
  }, []);

  // console.log('processedAddingItems', processedAddingItems);
  // console.log('processedDeletingItems', processedDeletingItems);
  // console.log('processedScanParams', processedScanParams);

  return (
    <PageContainer
      header={{
        title: (
          <Button
            size="small"
            icon={<LeftOutlined />}
            type="link"
            onClick={() => {
              history.push('/report/compliance');
            }}
          >
            返回合规列表
          </Button>
        ),
      }}
    >
      <ProDescriptions bordered column={2} labelStyle={{ width: 200 }} loading={loading}>
        <ProDescriptions.Item label="扫描版本" span={1}>
          <Badge color="blue" text={data.version} />
        </ProDescriptions.Item>

        <ProDescriptions.Item label="扫描时间" valueType="dateTime" span={1}>
          {data.createdAt}
        </ProDescriptions.Item>

        <ProDescriptions.Item label="仓库范围" span={1}>
          <div>
            {processedScanParams?.scanRepos.map((repo) => (
              <Badge color="green" count={repo} key={repo}></Badge>
            ))}
          </div>
        </ProDescriptions.Item>

        <ProDescriptions.Item label="排除国家" span={1}>
          <div>
            {processedScanParams?.countryCode.except.map((country: string) => (
              <Badge color="red" count={country} key={country}></Badge>
            ))}
          </div>
        </ProDescriptions.Item>

        <ProDescriptions.Item label="扫描国家" span={2}>
          <div>
            {processedScanParams?.countryCode.all.map((country: string) => (
              <Badge color="geekblue" count={country} key={country}></Badge>
            ))}
          </div>
        </ProDescriptions.Item>

        <ProDescriptions.Item label="文件后缀" span={2}>
          <div>
            {processedScanParams?.fileScope?.suffix &&
            Array.isArray(processedScanParams.fileScope.suffix)
              ? processedScanParams.fileScope.suffix.map((suffix: string) => (
                  <Badge color="blue" count={suffix} key={suffix}></Badge>
                ))
              : '-'}{' '}
          </div>
        </ProDescriptions.Item>

        <ProDescriptions.Item label="忽略文件" span={2}>
          <div>
            {processedScanParams?.fileScope?.ignore &&
            JSON.stringify(processedScanParams.fileScope.ignore) !== '{}'
              ? Object.entries(processedScanParams.fileScope.ignore).map(([key, value]) => (
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

        <ProDescriptions.Item label="新增项数量" span={1}>
          {processedAddingItems.length === 0 ? (
            '无'
          ) : (
            <Badge color="green" count={processedAddingItems.length} />
          )}
        </ProDescriptions.Item>

        <ProDescriptions.Item label="移除项数量" span={1}>
          {processedDeletingItems.length === 0 ? (
            '无'
          ) : (
            <Badge color="red" count={processedDeletingItems.length} />
          )}
        </ProDescriptions.Item>
      </ProDescriptions>

      <Segmented
        block
        options={[
          {
            label: '新增项',
            value: 'adding',
          },
          {
            label: '移除项',
            value: 'deleting',
          },
        ]}
        style={{ margin: '12px 0' }}
        value={tableTypeKey}
        onChange={setTableTypeKey}
      />
      {tableTypeKey === 'adding' && (
        <Table<ComplianceAPI.ComplianceAtomicItem>
          loading={loading}
          columns={columns}
          dataSource={processedAddingItems}
          pagination={false}
          expandable={{
            fixed: 'left',
          }}
          scroll={{ x: 'max-content' }}
        />
      )}
      {tableTypeKey === 'deleting' && (
        <Table<ComplianceAPI.ComplianceAtomicItem>
          loading={loading}
          columns={columns}
          dataSource={processedDeletingItems}
          pagination={false}
          expandable={{
            fixed: 'left',
          }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </PageContainer>
  );
};

export default ComplianceDetailV1;
