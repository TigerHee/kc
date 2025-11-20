import {
  deleteMustReadWiki,
  getMustReadWikisList,
  refreshMustReadWikiList,
  refreshMustReadWikiSingle,
} from '@/services/wikis';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { API } from 'types';
import { CreateMustReadWikiModalWithButton } from './components/CreateMustReadWikiModalWithButton';
import { Common } from 'types/common';
import { getUserListOptions } from '@/services/user';
import UserGroupAvatar from '@/components/UserGroupAvatar';
import { Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const MustReadWikiList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState<{ pageId: string; loading: boolean }[]>([]);
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);

  useEffect(() => {
    getUserListOptions().then((res) => {
      setUserOptions(res.sort((a, b) => a.label.localeCompare(b.label)));
    });
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    refreshMustReadWikiList()
      .then(() => {
        actionRef.current?.reload();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ProColumns<API.MustReadWikisItem>[] = [
    {
      title: 'id',
      dataIndex: '_id',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      copyable: true,
      ellipsis: true,
      width: 200,
    },
    {
      title: '链接',
      dataIndex: 'url',
      width: 200,
      hideInSearch: true,
      renderText: (text, record) => {
        return (
          <a href={text} target="_blank" rel="noreferrer">
            {record.title}
          </a>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '查看者',
      dataIndex: 'viewers',
      valueType: 'text',
      fixed: 'right',
      width: 360,
      renderText: (viewers: API.WikiViewersItem[]) => {
        if ((viewers ?? []).length === 0 || userOptions.length === 0) {
          return '-';
        }
        const data = (viewers || [])
          .map((viewer) => userOptions.find((opt) => opt.value === viewer.userId))
          .filter(Boolean)
          .map((viewer) => ({
            name: viewer?.label,
            email: viewer?.email,
            _id: viewer?.value,
          })) as unknown as API.UserItem[];
        return <UserGroupAvatar data={data ?? []} max={12} />;
      },
    },
    {
      title: '操作',
      width: 120,
      valueType: 'text',
      fixed: 'right',
      renderText: (text, record) => {
        return (
          <Space size={10}>
            <Popconfirm
              onConfirm={() => {
                deleteMustReadWiki(record.pageId).then(() => {
                  actionRef.current?.reload();
                });
              }}
              title={'确认删除吗？'}
              placement="topLeft"
              description={'删除将会导致该文档不再是必读文档'}
              okText="确定"
              cancelText="取消"
            >
              <Button icon={<DeleteOutlined />} danger></Button>
            </Popconfirm>
            <Button
              icon={<ReloadOutlined />}
              loading={itemLoading.find((item) => item.pageId === record.pageId)?.loading}
              onClick={() => {
                setItemLoading(
                  itemLoading.map((item) => {
                    if (item.pageId === record.pageId) {
                      return {
                        ...item,
                        loading: true,
                      };
                    }
                    return item;
                  }),
                );
                refreshMustReadWikiSingle(record.pageId)
                  .then(() => {
                    actionRef.current?.reload();
                  })
                  .finally(() => {
                    setItemLoading(
                      itemLoading.map((item) => {
                        if (item.pageId === record.pageId) {
                          return {
                            ...item,
                            loading: false,
                          };
                        }
                        return item;
                      }),
                    );
                  });
              }}
            ></Button>
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
          headerTitle="必读文档列表"
          expandable={{
            fixed: 'left',
          }}
          search={{
            defaultCollapsed: false,
          }}
          loading={loading}
          rowKey="_id"
          columns={columns}
          actionRef={actionRef}
          request={async (params) => {
            console.log('request.params', params);
            const res = await getMustReadWikisList(params);
            setItemLoading(
              res.list.map((item) => ({
                loading: false,
                pageId: item.pageId,
              })),
            );
            return {
              data: res.list,
              success: true,
              total: res.total,
            };
          }}
          toolBarRender={() => [
            <CreateMustReadWikiModalWithButton
              key="add"
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />,
            <Button key="refresh" icon={<ReloadOutlined />} onClick={() => handleRefresh()}>
              刷新阅读数据
            </Button>,
          ]}
        />
      </PageContainer>
    </div>
  );
};

export default MustReadWikiList;
