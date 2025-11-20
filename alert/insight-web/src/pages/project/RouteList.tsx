import {
  ActionType,
  ColumnsState,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Badge, Button, Collapse, Segmented, Space, Tag, Tooltip, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { API } from 'types';
import { getRouteList } from '@/services/route';
import {
  getProjectGatherRoute,
  getProjectsOptions,
  reloadProjectRoutes,
} from '@/services/projects';
import { LockOutlined, ReloadOutlined } from '@ant-design/icons';
import { Common } from 'types/common';
import { getUserListOptions } from '@/services/user';
import { UpdateRouteModalWithButton } from './components/UpdateRouteModalWithButton';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import ProjectAvatarWithName from '@/components/ProjectAvatarWithName';

const RouteList: React.FC = () => {
  const [dimensionKey, setDimensionKey] = useState<'project' | 'route'>('route');
  const actionRef = useRef<ActionType>();
  const [projectOptions, setProjectOptions] = useState<Common.SelectOptionItem[]>([]);
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);
  const [projectItemLoading, setProjectItemLoading] = useState<Record<string, boolean>>();
  const [columnsState, setColumnsState] = useState<Record<string, ColumnsState>>({
    createdAt: {
      show: false,
    },
  });

  useEffect(() => {
    getProjectsOptions().then((res) => {
      setProjectOptions(res);
    });
    getUserListOptions().then((res) => {
      setUserOptions(res);
    });
  }, []);

  const handleReloadProjectRoute = (id: string) => {
    message.info('路由解析中，大约需要5~10s，请耐心等待，不要重复刷新');
    setProjectItemLoading((prev) => {
      return {
        ...prev,
        [id]: true,
      };
    });
    reloadProjectRoutes(id)
      .then(() => {
        message.success('刷新成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      })
      .finally(() => {
        setProjectItemLoading((prev) => {
          return {
            ...prev,
            [id]: false,
          };
        });
      });
  };

  const routeColumns: ProColumns<API.RouteItem>[] = [
    {
      title: '路由',
      dataIndex: 'path',
      valueType: 'text',
      fixed: 'left',
      width: 300,
      renderText: (text, record) => {
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
      valueType: 'text',
      hidden: true,
    },
    {
      title: '页面链接',
      dataIndex: 'accessibleLink',
      valueType: 'text',
      hidden: true,
    },
    {
      title: '项目',
      dataIndex: 'project',
      valueType: 'select',
      align: 'left',
      width: 200,
      fieldProps: {
        showSearch: true,
      },
      valueEnum: projectOptions
        .sort((a, b) => {
          return a.label.localeCompare(b.label);
        })
        .reduce((acc, cur) => {
          Object.assign(acc, {
            [cur.value]: { text: cur.label },
          });
          return acc;
        }, {}),
      renderText: (text, record) => {
        return <ProjectAvatarWithName project={{ name: record.project?.name }} />;
      },
    },
    {
      title: '负责人',
      dataIndex: 'user',
      valueType: 'text',
      fieldProps: {
        showSearch: true,
      },
      valueEnum: userOptions
        .sort((a, b) => {
          return a.label.localeCompare(b.label);
        })
        .reduce((acc, cur) => {
          Object.assign(acc, {
            [cur.value]: { text: cur.label },
          });
          return acc;
        }, {}),
      width: 200,
      renderText(text, record) {
        return <UserAvatarWithName user={record?.user} />;
      },
    },
    {
      title: '基础配置',
      dataIndex: 'accessibleLink',
      hideInSearch: true,
      valueType: 'text',
      align: 'left',
      width: 450,
      renderText: (text, record) => {
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
      valueType: 'select',
      valueEnum: {
        KC: { text: '国际站' },
        TH: { text: '泰国站' },
        TR: { text: '土耳其站' },
      },
      width: 120,
      renderText: (tenant) => {
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
      hideInSearch: true,
      dataIndex: 'competitor',
      valueType: 'text',
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
      hideInSearch: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      align: 'center',
      width: 200,
    },
    {
      title: '更新时间',
      hideInSearch: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      width: 100,
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      renderText: (text, record) => {
        return (
          <>
            <UpdateRouteModalWithButton
              data={record}
              userOptions={userOptions}
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />
          </>
        );
      },
    },
    {
      title: '仅看待配置',
      valueType: 'switch',
      dataIndex: 'isWaitingConfig',
      hideInTable: true,
      hideInForm: true,
      hideInSetting: true,
      fieldProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
    {
      title: '仅看忽略',
      valueType: 'switch',
      dataIndex: 'isIgnore',
      hideInTable: true,
      hideInForm: true,
      hideInSetting: true,
      fieldProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
  ];

  const projectColumns: ProColumns<API.ProjectGatherRouteItem>[] = [
    {
      dataIndex: 'name',
      title: '项目',
      valueType: 'select',
      hideInSearch: true,
      fixed: 'left',
      width: 240,
      renderText: (text, record) => {
        return <ProjectAvatarWithName project={{ name: record?.name }} />;
      },
    },
    {
      dataIndex: 'owner',
      title: '负责人',
      valueType: 'select',
      valueEnum: userOptions.reduce((acc, cur) => {
        Object.assign(acc, {
          [cur.value]: { text: cur.label },
        });
        return acc;
      }, {}),
      width: 180,
      renderText(text, record) {
        return <UserAvatarWithName user={record.owner} />;
      },
    },
    {
      dataIndex: 'accessibleLink',
      hideInSearch: true,
      title: '可访问链接',
      width: 300,
      renderText(text) {
        return (
          <a href={text} target="_blank" rel="noreferrer">
            {text}
          </a>
        );
      },
    },
    {
      title: '路由',
      dataIndex: 'route',
      valueType: 'text',
      width: 360,
      renderText: (_, record) => {
        if (!record.routes) {
          return null;
        }
        return (
          <Collapse
            items={[
              {
                key: 1,
                label: (
                  <>
                    路由条目
                    <Badge
                      className="site-badge-count-109"
                      count={record.routes.length}
                      style={{ backgroundColor: '#01bc8d', marginLeft: 10 }}
                    />
                  </>
                ),
                // `路由条目 (${record.routes.length})`,
                children: (
                  <div>
                    {record.routes
                      .sort((a, b) => {
                        // 将两个字符串的首字母转换为小写进行比较
                        return a > b ? 1 : -1;
                      })
                      .map((route) => {
                        return <div key={route._id}>{route.path}</div>;
                      })}
                  </div>
                ),
              },
            ]}
          />
        );
      },
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createdAt',
      colSize: 2,
      valueType: 'dateTimeRange',
      render: (text, record) => {
        return formatDateToYYYYMMDDHHmmss(record.createdAt);
      },
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTimeRange',
      colSize: 2,
      align: 'center',
      width: 200,
      render: (text, record) => {
        if (!record.updatedAt) {
          return '-';
        }
        return formatDateToYYYYMMDDHHmmss(record.updatedAt);
      },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            <Button
              loading={projectItemLoading?.[record._id] ?? false}
              icon={<ReloadOutlined />}
              onClick={() => handleReloadProjectRoute(record._id)}
              type="primary"
            >
              刷新路由
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <Segmented
        block
        options={[
          {
            label: '项目维度',
            value: 'project',
          },
          {
            label: '路由维度',
            value: 'route',
          },
        ]}
        style={{ marginBottom: 12 }}
        value={dimensionKey}
        onChange={setDimensionKey}
      />
      {dimensionKey === 'route' && (
        <ProTable
          headerTitle="路由列表"
          toolBarRender={() => []}
          rowKey="_id"
          actionRef={actionRef}
          expandable={{
            fixed: 'left',
          }}
          search={{
            defaultCollapsed: false,
          }}
          columns={routeColumns}
          request={async (params) => {
            const res = await getRouteList(params);
            return {
              data: res.list,
              success: true,
              total: res.total,
            };
          }}
          columnsState={{
            value: columnsState,
            onChange: setColumnsState,
          }}
        />
      )}
      {dimensionKey === 'project' && (
        <ProTable
          headerTitle="项目路由列表"
          rowKey="_id"
          actionRef={actionRef}
          expandable={{
            fixed: 'left',
          }}
          search={{
            defaultCollapsed: false,
          }}
          columns={projectColumns}
          columnsState={{
            value: columnsState,
            onChange: setColumnsState,
          }}
          request={async (params) => {
            const res = await getProjectGatherRoute(params);
            setProjectItemLoading(
              res.list.reduce((acc, cur) => {
                Object.assign(acc, {
                  [cur._id]: false,
                });
                return acc;
              }, {}),
            );
            return {
              success: true,
              data: res.list,
              total: res.total,
            };
          }}
        />
      )}
    </PageContainer>
  );
};

export default RouteList;
