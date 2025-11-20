import UserAvatarWithName from '@/components/UserAvatarWithName';
import { getPrRejectRecordList, getUserListOptions } from '@/services/user';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { API } from 'types';
import { Common } from 'types/common';

const PrRejectRecordList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);

  useEffect(() => {
    getUserListOptions().then((res) => {
      setUserOptions(res.sort((a, b) => a.label.localeCompare(b.label)));
    });
  }, []);

  const columns: ProColumns<API.PrRejectRecordItem>[] = [
    {
      title: '记录ID',
      dataIndex: '_id',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      copyable: true,
      ellipsis: true,
      width: 200,
    },
    {
      title: 'PR链接',
      dataIndex: 'link',
      hideInSearch: true,
      width: 300,
      renderText: (text) => {
        return (
          <a href={text} target="_blank" rel="noreferrer">
            {text}
          </a>
        );
      },
    },
    {
      title: '提交人',
      dataIndex: 'user',
      filterSearch: true,
      valueEnum: userOptions.reduce((acc, cur) => {
        // acc[cur.value] = { text: cur.label };
        Object.assign(acc, { [cur.value]: { text: cur.label } });
        return acc;
      }, {}),
      width: 250,
      renderText(text) {
        return <UserAvatarWithName user={text} />;
      },
    },
    {
      title: '拒绝原因',
      hideInSearch: true,
      dataIndex: 'reason',
      valueType: 'text',
      width: 300,
    },
    {
      title: '拒绝时间',
      hideInSearch: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 160,
    },
  ];

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <ProTable
        headerTitle="PR拒绝记录"
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
          console.log('request.params', params);
          const res = await getPrRejectRecordList(params);
          return {
            data: res.list,
            success: true,
            total: res.total,
          };
        }}
      />
    </PageContainer>
  );
};

export default PrRejectRecordList;
