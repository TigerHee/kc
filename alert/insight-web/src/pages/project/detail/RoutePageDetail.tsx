import UserAvatarWithName from '@/components/UserAvatarWithName';
import { getProjectDetailByNameRoutes } from '@/services/projects';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import { LockOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { Badge, Collapse, Space, Table, Tag, Tooltip } from 'antd';
import { TableProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { API } from 'types';

const RoutePageDetail: React.FC<{
  name: string;
  detail: API.ProjectsItemDetail;
}> = (props) => {
  const { name, detail } = props;
  const [data, setData] = useState<API.RouteItem[]>([]);

  const columns: TableProps<API.RouteItem>['columns'] = [
    {
      title: '路由',
      dataIndex: 'path',
      fixed: 'left',
      width: 300,
      render: (text, record) => {
        return (
          <>
            {!record.isIgnore && !record?.accessibleLink && (
              <>
                <Tag color="red">待配置</Tag>
                <br />
              </>
            )}
            {text} {record.isIgnore && <Tag color="cyan">忽略</Tag>}
          </>
        );
      },
    },
    {
      title: '页面标题',
      dataIndex: 'title',
      hidden: true,
    },
    {
      title: '页面链接',
      dataIndex: 'accessibleLink',
      hidden: true,
    },
    {
      title: '负责人',
      dataIndex: 'user',
      width: 200,
      render(text, record) {
        return <UserAvatarWithName user={record?.user} />;
      },
    },
    {
      title: '基础配置',
      dataIndex: 'accessibleLink',
      align: 'left',
      width: 450,
      render: (text, record) => {
        if (!text) return '-';
        return (
          <ProDescriptions key={record._id} bordered column={2}>
            <ProDescriptions.Item labelStyle={{ width: 110 }} label="页面标题" span={2}>
              {record.title}
            </ProDescriptions.Item>
            <ProDescriptions.Item labelStyle={{ width: 110 }} label="页面链接" span={2}>
              <a href={text} target="_blank" rel="noreferrer">
                {text}
              </a>
              {record.isNeedLogin && (
                <Tooltip title="需要登录访问">
                  <LockOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              )}
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '租户',
      dataIndex: 'tenant',
      width: 120,
      render: (tenant) => {
        if (tenant === null) {
          return '-';
        }
        return (
          <>
            {[
              {
                value: 'KC',
                text: '国际站',
              },
              {
                value: 'TH',
                text: '泰国站',
              },
              {
                value: 'TR',
                text: '土耳其站',
              },
            ].map((item) => {
              return (
                <Badge
                  key={item.value}
                  style={{ display: 'block' }}
                  status={tenant.includes(item.value) ? 'success' : 'default'}
                  text={item.text}
                />
              );
            })}
          </>
        );
      },
    },
    {
      title: '竞对信息',
      width: 500,
      dataIndex: 'competitor',
      render: (_, record) => {
        let data: Record<
          string,
          {
            url: string;
            mustLogin: boolean;
          }
        > | null = null;
        try {
          data = JSON.parse(record.competitor);
        } catch (error) {
          data = null;
        }
        if (data === null) return '-';
        const res = Object.entries(data).map(([key, value]) => {
          if (JSON.stringify(value) === '{}') {
            return null;
          }
          return (
            <ProDescriptions key={key} bordered>
              <ProDescriptions.Item
                labelStyle={{ width: 120 }}
                label={<Tag color="processing">{key}</Tag>}
              >
                <a href={value?.url} target="_blank" rel="noreferrer">
                  {value?.url}
                </a>
                {value.mustLogin && (
                  <Tooltip title="需要登录访问">
                    <LockOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                )}
              </ProDescriptions.Item>
            </ProDescriptions>
          );
        });
        if (res.length === 0 || res.every((item) => item === null)) return '-';
        return (
          <Collapse
            items={[
              {
                key: '1',
                label: (
                  <>
                    竞对数据条目
                    <Badge
                      className="site-badge-count-109"
                      count={res.filter(Boolean).length}
                      style={{ backgroundColor: '#01bc8d', marginLeft: 10 }}
                    />
                  </>
                ),
                children: (
                  <Space size={10} direction="vertical">
                    {res}
                  </Space>
                ),
              },
            ]}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      width: 200,
      render: (text) => {
        if (!text) return '-';
        return formatDateToYYYYMMDDHHmmss(text);
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      align: 'center',
      fixed: 'right',
      width: 200,
      render: (text) => {
        if (!text) return '-';
        return formatDateToYYYYMMDDHHmmss(text);
      },
    },
  ];

  useEffect(() => {
    if (name) {
      getProjectDetailByNameRoutes(name).then((res) => {
        setData(res);
      });
    }
  }, []);

  return (
    <>
      <ProDescriptions bordered column={2}>
        <ProDescriptions.Item label="状态">
          {detail.metaRoutes.status ? (
            <Badge status="success" text="开启" />
          ) : (
            <Badge status="default" text="未使用" />
          )}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="路由数量">
          <Badge
            className="site-badge-count-109"
            count={detail.metaRoutes.routes?.length ?? 0}
            style={{ backgroundColor: '#01bc8d', marginLeft: 10 }}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间" valueType="dateTime">
          {detail?.metaRoutes.updatedAt}
        </ProDescriptions.Item>
      </ProDescriptions>
      <Table<API.RouteItem>
        columns={columns}
        dataSource={data}
        expandable={{
          fixed: 'left',
        }}
      />
    </>
  );
};

export default RoutePageDetail;
