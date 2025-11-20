import UserAvatarWithName from '@/components/UserAvatarWithName';
import { deleteFeatureAnnouncement, getFeatureAnnouncementList } from '@/services/announcement';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { API } from 'types';
import { CreateFeatureUpdateModalWithButton } from './components/CreateFeatrueUpdateModalWithButton';
import TextArea from 'antd/es/input/TextArea';
import { Button, message } from 'antd';

const FeatureUpdateList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.FeatureAnnouncementItem>[] = [
    {
      title: '公告ID',
      dataIndex: '_id',
      fixed: 'left',
      hideInSearch: true,
      width: 240,
    },
    {
      title: '功能链接',
      dataIndex: 'manualsUrl',
      width: 300,
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
      render: (text, record) => {
        if (record.manualsUrl === '') {
          return <span>暂无链接</span>;
        }
        return <a href={`${record.manualsUrl}`}>{record.manualsUrl}</a>;
      },
    },
    {
      title: '文档链接',
      dataIndex: 'featureUrl',
      valueType: 'text',
      hideInSearch: true,
      width: 300,
      ellipsis: true,
      render: (text, record) => {
        if (record.featureUrl === '') {
          return <span>暂无链接</span>;
        }
        return <a href={`${record.featureUrl}`}>{record.featureUrl}</a>;
      },
    },
    {
      title: '公告内容',
      width: 500,
      hideInSearch: true,
      dataIndex: 'feature',
      render: (text, record) => {
        return (
          <div>
            <TextArea
              autoSize={{ minRows: 2, maxRows: 12 }}
              value={record.feature}
              bordered={false}
              readOnly
            ></TextArea>
          </div>
        );
      },
    },
    {
      title: '创建时间',
      width: 200,
      hideInSearch: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '发布人',
      dataIndex: 'user',
      valueType: 'text',
      align: 'center',
      fixed: 'right',
      width: 240,
      hideInSearch: true,
      renderText: (user) => {
        return <UserAvatarWithName user={user} />;
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 140,
      hideInSearch: true,
      fixed: 'right',
      renderText: (_, record) => {
        return (
          <Button
            danger
            onClick={() => {
              deleteFeatureAnnouncement(record._id).then(() => {
                message.success('删除成功');
                actionRef.current?.reload();
              });
            }}
          >
            删除
          </Button>
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
          headerTitle="功能更新公告列表"
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
            const res = await getFeatureAnnouncementList(params);
            return {
              data: res.list,
              success: true,
              total: res.total,
            };
          }}
          toolBarRender={() => [
            <CreateFeatureUpdateModalWithButton
              key="publish"
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />,
          ]}
        />
      </PageContainer>
    </div>
  );
};

export default FeatureUpdateList;
