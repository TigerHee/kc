import UserAvatarWithName from '@/components/UserAvatarWithName';
import { getAlarmListForAdmin } from '@/services/notification';
import { generateAvatarEnglishNameString, generateEnglishNameColor } from '@/utils/string';
import { ArrowRightOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions, ProList, ProListProps } from '@ant-design/pro-components';
import { Avatar, Popover, Space, Tag } from 'antd';
import { useState } from 'react';
import { API } from 'types';

const AlarmList = () => {
  const [currentRow, setCurrentRow] = useState<API.AlarmItem | null>(null);
  const metas: ProListProps['metas'] = {
    title: {
      search: false,
      title: '告警内容',
      render: (_, row) => {
        return <Space size={0}>{row.warnText}</Space>;
      },
    },
    avatar: {
      dataIndex: 'avatar',
      search: false,
      render: (_, row: API.AlarmItem) => {
        return (
          <Popover content={row.slug} title="仓库信息" trigger="hover">
            <Avatar style={{ backgroundColor: generateEnglishNameColor(row.slug).color }}>
              {generateAvatarEnglishNameString(row.slug)}
            </Avatar>
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
      search: false,
      render: (_: any, row: API.AlarmItem) => {
        return (
          <Space size={30}>
            <Space size={10} direction="vertical">
              <UserAvatarWithName user={row.author} style={{ width: 200, paddingLeft: 30 }} />
            </Space>
            <div style={{ width: 200 }}>
              {row.commitId && (
                <ProDescriptions>
                  <ProDescriptions.Item label="Commit ID">
                    <a
                      href={row.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        setCurrentRow(row);
                      }}
                    >
                      {currentRow?._id === row._id && <ArrowRightOutlined color="blue" />}
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
    <PageContainer
      header={{
        title: null,
      }}
    >
      <ProList
        search={{
          filterType: 'light',
        }}
        rowKey="_id"
        request={async (params = {} as Record<string, any>) => {
          const data = await getAlarmListForAdmin(params);
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
    </PageContainer>
  );
};

export default AlarmList;
