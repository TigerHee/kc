// interface AlarmNotificationProps {

import { getAlarmList, getUnreadAlarmCount, setAlarmReadAction } from '@/services/notification';
import { generateAvatarEnglishNameString, generateEnglishNameColor } from '@/utils/string';
import { ActionType, ProDescriptions, ProList, ProListProps } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Badge, Popover, Space, Tag, message } from 'antd';
import { useRef } from 'react';
import { API } from 'types';

const AlarmNotification: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { setInitialState, initialState } = useModel('@@initialState');

  const handleRead = (id: string) => {
    setAlarmReadAction(id).then(async () => {
      message.success('标记已读成功');
      actionRef.current?.reload();
      const unReadAlarmCount = await getUnreadAlarmCount();
      setInitialState({
        ...initialState,
        unReadAlarmCount,
      });
    });
  };

  const metas: ProListProps['metas'] = {
    title: {
      dataIndex: 'warnText',
      search: false,
      title: '告警内容',
      render: (_, row) => {
        return (
          <Space
            size={0}
            onClick={() => {
              if (!row.readStatus) {
                handleRead(row._id);
              }
            }}
          >
            {row.warnText}
          </Space>
        );
      },
    },
    avatar: {
      dataIndex: 'avatar',
      search: false,
      render: (_, row: API.AlarmItem) => {
        return (
          <Popover content={row.slug} title="仓库信息" trigger="hover">
            <Badge dot={!row.readStatus}>
              <Avatar style={{ backgroundColor: generateEnglishNameColor(row.slug).color }}>
                {generateAvatarEnglishNameString(row.slug)}
              </Avatar>
            </Badge>
          </Popover>
        );
      },
    },
    description: {
      dataIndex: 'title',
      search: false,
      render: (_, row) => {
        return (
          <div>
            {row.message}
            <Tag style={{ marginLeft: 10 }}>{row.slug}</Tag>
            <Tag>{row.branch}</Tag>
          </div>
        );
      },
    },
    subTitle: {
      render: (_, row) => {
        return (
          <Space size={0}>
            <Tag color="blue">{row.slug}</Tag>
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
          <Space size={30}>
            <div style={{ width: 200 }}>
              {row.commitId && (
                <ProDescriptions>
                  <ProDescriptions.Item label="Commit ID">
                    <a href={row.commitUrl} target="_blank" rel="noreferrer">
                      {row.commitId}
                    </a>
                  </ProDescriptions.Item>
                </ProDescriptions>
              )}
            </div>
            <div style={{ width: 250 }}>
              <ProDescriptions>
                <ProDescriptions.Item label="提交时间" valueType="dateTime">
                  {row.createdAt}
                </ProDescriptions.Item>
              </ProDescriptions>
            </div>
          </Space>
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
        const data = await getAlarmList(params);
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

export default AlarmNotification;
