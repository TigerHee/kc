import {
  getSystemMessageList,
  getUnreadMessageCount,
  setSystemReadAction,
} from '@/services/notification';
import { ActionType, ProDescriptions, ProList, ProListProps } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Badge, Space, Tag, message } from 'antd';
import { useRef } from 'react';
import { API } from 'types';

const SystemNotification: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { setInitialState, initialState } = useModel('@@initialState');

  const handleRead = (id: string) => {
    setSystemReadAction(id).then(async () => {
      message.success('标记已读成功');
      actionRef.current?.reload();
      const unReadMessageCount = await getUnreadMessageCount();
      setInitialState({
        ...initialState,
        unReadMessageCount,
      });
    });
  };

  const metas: ProListProps['metas'] = {
    title: {
      dataIndex: 'title',
      search: false,
      title: '系统消息',
      render: (_, row: API.SystemMessageItem) => {
        return (
          <Space
            size={0}
            onClick={() => {
              if (!row.readStatus) {
                handleRead(row._id);
              }
            }}
          >
            {row.title}
          </Space>
        );
      },
    },
    avatar: {
      dataIndex: 'avatar',
      search: false,
      render: (_, row: API.SystemMessageItem) => {
        return (
          <Badge dot={!row.readStatus}>
            <Avatar>{row.type.slice(0, 1).toLocaleUpperCase()}</Avatar>
          </Badge>
        );
      },
    },

    description: {
      dataIndex: 'title',
      search: false,
      render: (_, row: API.SystemMessageItem) => {
        return (
          <div>
            <Space size={0}>{row.content}</Space>
          </div>
        );
      },
    },
    subTitle: {
      render: (_, row) => {
        return (
          <Space size={0}>
            <Tag color="blue">{row.type}</Tag>
          </Space>
        );
      },
      search: false,
    },
    extra: {
      dataIndex: 'cratedAt',
      search: false,
      render: (_: any, row: any) => {
        return (
          <div style={{ width: 250 }}>
            <ProDescriptions>
              <ProDescriptions.Item label="消息时间" valueType="dateTime">
                {row.createdAt}
              </ProDescriptions.Item>
            </ProDescriptions>
          </div>
        );
      },
    },
  };

  return (
    <ProList
      search={{
        filterType: 'light',
      }}
      actionRef={actionRef}
      rowKey="_id"
      request={async (params = {} as Record<string, any>) => {
        const data = await getSystemMessageList(params);
        return {
          data: data.list,
          total: data.total,
          success: true,
        };
      }}
      pagination={{
        pageSize: 20,
      }}
      showActions="hover"
      metas={metas}
    />
  );
};

export default SystemNotification;
