import UserAvatarWithName from '@/components/UserAvatarWithName';
import { getSystemBreakdownAnnouncementList } from '@/services/announcement';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import TextArea from 'antd/es/input/TextArea';
import { useRef } from 'react';
import { API } from 'types';
import { CreateSystemBreakdownModalWithButton } from './components/CreateSystemBreakdownModalWithButton';

const SystemBreakdownList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.SystemBreakdownAnnouncementItem>[] = [
    {
      title: '公告ID',
      dataIndex: '_id',
      fixed: 'left',
      width: 240,
      hideInSearch: true,
    },
    {
      title: '开始时间',
      width: 200,
      hideInSearch: true,
      dataIndex: 'startAt',
      valueType: 'dateTime',
    },
    {
      title: '完成时间',
      width: 200,
      hideInSearch: true,
      dataIndex: 'finishAt',
      valueType: 'dateTime',
    },
    {
      title: '公告内容',
      width: 500,
      hideInSearch: true,
      dataIndex: 'content',
      render: (text, record) => {
        return (
          <div>
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              value={record.content}
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
      width: 240,
      align: 'center',
      hideInSearch: true,
      fixed: 'right',
      renderText: (user) => {
        return <UserAvatarWithName user={user} />;
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
          headerTitle="系统停机公告列表"
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
            const res = await getSystemBreakdownAnnouncementList(params);
            return {
              data: res.list,
              success: true,
              total: res.total,
            };
          }}
          toolBarRender={() => [
            <CreateSystemBreakdownModalWithButton
              key="create"
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

export default SystemBreakdownList;
