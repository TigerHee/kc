import {
  PageContainer,
  ProCard,
  ProDescriptions,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from '@ant-design/pro-components';
import { CreateTaskModalWithButton } from './components/CreateTaskModalWithButton';
import { useEffect, useState } from 'react';
import { API } from 'types';
import { deleteTask, getTaskDetail, getTaskList, refreshTask } from '@/services/tasks';
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Segmented,
  Space,
  Table,
  TableProps,
  message,
} from 'antd';
import {
  AppstoreOutlined,
  BarsOutlined,
  DeleteOutlined,
  RadarChartOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import TaskItemCard from './components/TaskItemCard';
import { UserSelect } from '@/components/UserSelect';
import RcResizeObserver from 'rc-resize-observer';
import { UpdateTaskModalWithButton } from './components/UpdateTaskModalWithButton';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import RepoGroupAvatar from '@/components/RepoGroupAvatar';
import UserGroupAvatar from '@/components/UserGroupAvatar';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import { Typography } from 'antd';
import useUser from '@/hooks/useUser';
import { getUserListOptions } from '@/services/user';
import { Common } from 'types/common';
import CommitTypeSelect from '@/components/CommitTypeSelect';

const { Paragraph } = Typography;

const TaskList: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [total, setTotal] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [selfTotal, setSelfTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.TaskItem[]>([]);
  const [scopeKey, setScopeKey] = useState('all');
  const [searchForm] = Form.useForm();
  const [responsive, setResponsive] = useState(false);
  const [itemLoading, setItemLoading] = useState<Record<string, boolean>>();
  const [viewType, setViewType] = useState<'Kanban' | 'List'>('List');
  const { isAdmin } = useUser();
  const isShowDeleteBtn = isAdmin || (!isAdmin && scopeKey === 'self');
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);
  const [copyPrefix, setCopyPrefix] = useState('feat');

  useEffect(() => {
    getUserListOptions().then((res) => {
      setUserOptions(res);
    });
  }, []);

  const params = {
    scope: scopeKey,
  };

  const fetchData = async (_query: any) => {
    setLoading(true);
    const _search = searchForm.getFieldsValue();
    console.log(_search);
    getTaskList({
      ..._query,
      ..._search,
    })
      .then((res) => {
        console.log(res.list);
        setList(res.list);
        setTotal(res.total);
        setAllTotal(res.allTotal);
        setSelfTotal(res.selfTotal);
        setItemLoading({
          ...list.reduce((acc, cur) => {
            Object.assign(acc, { [cur._id]: false });
            return acc;
          }, {}),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData({ ...params, ...pagination });
  }, []);

  const handleDelete = (id: string) => {
    deleteTask(id).then(() => {
      fetchData({ ...params, ...pagination });
      message.success('删除成功');
    });
  };

  const handleRefresh = (id: string) => {
    setItemLoading({
      ...itemLoading,
      [id]: true,
    });
    message.loading('刷新中...');
    refreshTask(id)
      .then(() => {
        getTaskDetail(id).then((res) => {
          setList((list) => {
            const index = list.findIndex((item) => item._id === id);
            if (index > -1) {
              list[index] = res;
            }
            return [...list];
          });
          message.destroy();
          message.success('刷新成功');
        });
      })
      .finally(() => {
        setItemLoading({
          ...itemLoading,
          [id]: false,
        });
      });
  };

  const handleGoDetail = (id: string) => {
    history.push(`/task/detail/${id}`);
  };

  const columns: TableProps<API.TaskItem>['columns'] = [
    {
      title: () => {
        return (
          <>
            ID
            <CommitTypeSelect value={copyPrefix} onChange={(value) => setCopyPrefix(value)} />
          </>
        );
      },
      dataIndex: 'taskId',
      key: 'taskId',
      width: 180,
      fixed: 'left',
      render: (_, task) => {
        return (
          <ProDescriptions>
            <ProDescriptions.Item label={null} valueType="text">
              <Paragraph copyable={{ text: `${copyPrefix}(${task.taskId}): ` }}>
                {task.taskId}
              </Paragraph>
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '负责人',
      width: 200,
      dataIndex: 'user',
      key: 'user',
      render: (_, task) => {
        return <UserAvatarWithName user={task.user} />;
      },
    },
    {
      title: '方案状态',
      width: 140,
      render: (_, task) => {
        return (
          <ProDescriptions>
            <ProDescriptions.Item label={null}>
              {task.wiki.status ? (
                <Badge color="green" count={`已通过`}></Badge>
              ) : (
                <Popover
                  content={
                    <div>
                      {task.wiki.errors.map(({ title, content }) => (
                        <div key={title}>
                          <b style={{ fontWeight: 500 }}>{title}: </b>
                          <span style={{ color: 'red' }}>{content}</span>
                        </div>
                      ))}
                    </div>
                  }
                >
                  <Badge color="red" count={`未通过`}></Badge>
                </Popover>
              )}
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: 'Hybrid审核',
      width: 140,
      render: (_, task) => {
        if (!task.wiki.status) {
          return <Badge color="gray" count={`wiki状态异常`}></Badge>;
        }
        if (
          task.wiki?.needH5Audit === undefined ||
          task.wiki?.needH5Audit === null ||
          task.wiki?.needH5Audit === false
        ) {
          return <Badge color="green" count={`非Hybrid页面`}></Badge>;
        }
        if (task.wiki.h5AuditStatus === true) {
          return <Badge color="green" count={`已通过`}></Badge>;
        }
        if (task.wiki.h5AuditStatus === false) {
          return <Badge color="red" count={`未通过`}></Badge>;
        }
        return '-';
      },
    },
    {
      title: '流程版本',
      width: 100,
      align: 'center',
      render: (_, task) => {
        return (
          <Badge
            color="green"
            count={task.wikiCheckerVersion.toFixed(1)}
            style={{ backgroundColor: '#52c41a' }}
          />
        );
      },
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 250,
      key: 'name',
      render: (_, task) => {
        return (
          <ProDescriptions>
            <ProDescriptions.Item label={null} valueType="text" ellipsis>
              {task.taskName}
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '方案链接',
      width: 300,
      render: (_, task) => {
        return (
          <ProDescriptions>
            <ProDescriptions.Item label={null} ellipsis>
              {task.wiki.title ? (
                <a href={task.wiki.url} target="_blank" rel="noreferrer">
                  {task.wiki.title}
                </a>
              ) : (
                '-'
              )}
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '使用人',
      width: 250,
      dataIndex: 'involveUsers',
      render: (_, task) => {
        return <UserGroupAvatar data={task.involveUsers} max={8} />;
      },
    },
    {
      title: '相关仓库',
      width: 200,
      dataIndex: 'involveRepos',
      render: (_, task) => {
        return <RepoGroupAvatar data={task.involveRepos} />;
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, task) => {
        if (task.status) {
          return <Badge color="green" text="已完成"></Badge>;
        }
        return <Badge color="blue" text="进行中"></Badge>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (_, task) => {
        return (
          <ProDescriptions>
            <ProDescriptions.Item label={null} valueType="dateTime">
              {task.createdAt}
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      render: (_, task) => {
        return (
          <ProDescriptions>
            <ProDescriptions.Item label={null} valueType="dateTime">
              {task.updatedAt}
            </ProDescriptions.Item>
          </ProDescriptions>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 130,
      render: (_, task) => {
        return (
          <Space size={10}>
            <Button.Group>
              <Button
                key="refresh"
                type="default"
                color="default"
                icon={<ReloadOutlined color="yellow" />}
                onClick={() => handleRefresh(task._id)}
                loading={itemLoading?.[task._id] ?? false}
              >
                {/* 刷新 */}
              </Button>
              <UpdateTaskModalWithButton
                key="edit"
                onSuccess={() => fetchData({ ...params, ...pagination })}
                data={task}
              />
              {isShowDeleteBtn && (
                <Popconfirm
                  key="delete"
                  placement="topLeft"
                  title="确认删除吗？"
                  description="删除后将不可见，且使用该任务ID的提交将不符合规范"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={() => handleDelete(task._id)}
                >
                  <Button danger type="default" icon={<DeleteOutlined color="primary" />}>
                    {/* 删除 */}
                  </Button>
                </Popconfirm>
              )}
            </Button.Group>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <PageContainer
        fixedHeader
        subTitle={
          <Segmented
            value={viewType}
            onChange={(value: 'Kanban' | 'List') => {
              setViewType(value);
            }}
            options={[
              { value: 'Kanban', icon: <AppstoreOutlined /> },
              { value: 'List', icon: <BarsOutlined /> },
            ]}
          />
        }
        extra={
          <CreateTaskModalWithButton
            key="create"
            onSuccess={() => {
              fetchData({ ...params, ...pagination });
            }}
          />
        }
      >
        <Segmented
          options={[
            { label: `全部任务（${allTotal})`, value: 'all', icon: <RadarChartOutlined /> },
            { label: `我的任务（${selfTotal})`, value: 'self', icon: <UserOutlined /> },
          ]}
          block
          style={{ marginBottom: 8 }}
          value={scopeKey}
          onChange={(key) => {
            setScopeKey(key);
            searchForm.resetFields(['user']);
            fetchData({ ...params, ...pagination, scope: key });
          }}
        />
        <ProCard style={{ marginBottom: 10 }}>
          <QueryFilter
            split
            form={searchForm}
            defaultCollapsed={false}
            onFinish={async (value) => {
              console.log('onFinish', value);
              await fetchData({ ...params, ...pagination });
              return true;
            }}
          >
            <ProFormText name="taskId" label="任务ID" placeholder="输入任务ID" />
            <ProFormText name="name" label="任务名称" placeholder="输入任务名称" />
            {scopeKey === 'all' && (
              <Form.Item name="user" label="负责人">
                <UserSelect
                  placeholder="选择负责人"
                  maxCount={10}
                  mode="multiple"
                  userOptions={userOptions}
                />
              </Form.Item>
            )}
            <ProFormSelect
              name="status"
              label="任务状态"
              placeholder="选择任务状态"
              options={[
                { label: '进行中', value: 'false' },
                { label: '已完成', value: 'true' },
              ]}
            />
            <ProFormDateTimeRangePicker
              name="createdAt"
              label="创建时间"
              placeholder={['开始时间', '结束时间']}
              dataFormat="YYYY-MM-DD HH:mm:ss"
              colSize={2}
              transform={(v) => [
                formatDateToYYYYMMDDHHmmss(v?.[0]),
                formatDateToYYYYMMDDHHmmss(v?.[1]),
              ]}
            />
          </QueryFilter>
        </ProCard>
        <Card loading={loading} bordered={false}>
          {viewType === 'Kanban' && (
            <RcResizeObserver
              key="resize-observer"
              onResize={(offset) => {
                setResponsive(offset.width < 1280);
              }}
            >
              <Row gutter={[16, 16]}>
                {list.map((task) => (
                  <Col span={responsive ? 24 : 12} key={task._id}>
                    <TaskItemCard
                      loading={itemLoading?.[task._id] ?? false}
                      task={task}
                      onEditSuccess={() => fetchData({ ...params, ...pagination })}
                      handleRefresh={handleRefresh}
                      handleDelete={handleDelete}
                      handleGoDetail={handleGoDetail}
                      isShowDeleteBtn={isShowDeleteBtn}
                    />
                  </Col>
                ))}
              </Row>
              {list.length === 0 && loading === false && <Empty />}
            </RcResizeObserver>
          )}
          {viewType === 'List' && (
            <>
              <Table<API.TaskItem>
                columns={columns}
                dataSource={list}
                pagination={false}
                expandable={{ fixed: 'left' }}
              />
            </>
          )}
          <Pagination
            key="pagination"
            size="small"
            style={{ padding: '16px 0', justifyContent: 'flex-end' }}
            {...pagination}
            total={total}
            showSizeChanger
            showTotal={(total) => `总共 ${total} 任务`}
            onShowSizeChange={(current, pageSize) => {
              fetchData({
                ...params,
                current,
                pageSize,
              });
            }}
            onChange={(page, pageSize) => {
              setPagination({
                current: page,
                pageSize,
              });
              fetchData({
                ...params,
                current: page,
                pageSize,
              });
            }}
          />
        </Card>
      </PageContainer>
    </div>
  );
};
export default TaskList;
