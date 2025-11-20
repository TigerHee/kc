import { deleteUser, getUserList } from '@/services/user';
import {
  ActionType,
  ColumnsState,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { API } from 'types';
import { UpdateUserInfoModalWithButton } from './components/UpdateUserInfoModalWithButton';
import { useRef, useState } from 'react';
import { Badge, Button, Popconfirm, Popover, Space } from 'antd';
import { DeleteOutlined, OrderedListOutlined } from '@ant-design/icons';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import { history } from '@umijs/max';
import { CreateUserInfoModalWithButton } from './components/CreateUserInfoModalWithButton';
import ActionLogsDrawer from './components/ActionLogsDrawer';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [actionLogVisible, setActionLogVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<API.UserItem | null>(null);
  const [columnsState, setColumnsState] = useState<Record<string, ColumnsState>>({
    _id: {
      show: false,
    },
    phone: {
      show: false,
    },
    lastLoginAt: {
      show: false,
    },
  });

  const handleDelete = (id: string) => {
    deleteUser(id).then(() => {
      actionRef.current?.reload();
    });
  };

  const columns: ProColumns<API.UserItem>[] = [
    {
      title: '形象',
      dataIndex: 'avatar',
      valueType: 'text',
      fixed: 'left',
      hideInSearch: true,
      hideInDescriptions: true,
      width: 60,
      renderText: (text, record) => {
        return <UserAvatarWithName user={record} simplify />;
      },
    },
    {
      title: 'uuid',
      dataIndex: '_id',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      copyable: true,
      ellipsis: true,
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'text',
      width: 160,
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        admin: { text: '管理员', color: 'blue' },
        super_admin: { text: '系统管理员', color: 'red' },
        user: { text: '用户', color: 'green' },
      },
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      width: 220,
      renderText: (text) => {
        return <a href={`mailto:${text}`}>{text}</a>;
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      valueType: 'text',
      width: 220,
    },
    {
      title: '创建时间',
      hideInSearch: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: 'PR权限',
      dataIndex: 'prAuthStatus',
      width: 120,
      valueType: 'text',
      valueEnum: {
        true: { text: '开启', status: 'Success' },
        false: { text: '关闭', status: 'Error' },
      },
      renderText: (text, record) => {
        return record.prAuth?.status ? (
          <Badge count="开启" color="green"></Badge>
        ) : (
          <Popover placement="topLeft" title="拒绝原因" content={record.prAuth?.rejectReason}>
            <Badge count="关闭" color="red"></Badge>
          </Popover>
        );
      },
    },
    {
      title: '最后登录时间',
      hideInSearch: true,
      dataIndex: 'lastLoginAt',
      valueType: 'dateTime',
      width: 220,
    },
    {
      title: '必读状态',
      valueType: 'text',
      width: 140,
      align: 'center',
      dataIndex: 'readStatus',
      valueEnum: {
        success: { text: '已读', status: 'Success' },
        warning: { text: '存在未读最新', status: 'Warning' },
        error: { text: '存在未读', status: 'Error' },
      },
      renderText: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() =>
              history.push('/auth/wiki-status/' + record._id + '?username=' + record.name)
            }
          >
            <Badge
              count={
                record.readStatus === 'error'
                  ? '存在未读'
                  : record.readStatus === 'warning'
                    ? '存在未读最新'
                    : '已读'
              }
              color={
                record.readStatus === 'error'
                  ? 'red'
                  : record.readStatus === 'warning'
                    ? 'orange'
                    : 'green'
              }
            />
          </Button>
        );
      },
    },
    {
      title: '操作',
      width: 140,
      valueType: 'text',
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      renderText(text, record) {
        return (
          <Space size={10}>
            <Button
              icon={<OrderedListOutlined />}
              onClick={() => {
                setCurrentRow(record);
                setActionLogVisible(true);
              }}
            ></Button>
            <UpdateUserInfoModalWithButton
              data={record}
              onSuccess={() => setTimeout(() => actionRef.current?.reload(), 0)}
            />
            <Popconfirm
              title="确认删除？"
              description="删除后将不可见，且使用该用户ID的提交将不符合规范"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button icon={<DeleteOutlined />} danger></Button>
            </Popconfirm>
          </Space>
        );
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
          headerTitle="用户列表"
          expandable={{
            fixed: 'left',
          }}
          search={{
            defaultCollapsed: false,
          }}
          rowKey="_id"
          columns={columns}
          actionRef={actionRef}
          request={async (params) => {
            const res = await getUserList(params);
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
          toolBarRender={() => [
            <CreateUserInfoModalWithButton
              key="add"
              onSuccess={() => actionRef?.current?.reload()}
            />,
          ]}
        />
      </PageContainer>
      <ActionLogsDrawer
        id={currentRow?._id as string}
        visible={actionLogVisible}
        onClose={() => {
          setActionLogVisible(false);
          setCurrentRow(null);
        }}
      />
    </div>
  );
};
export default UserList;
