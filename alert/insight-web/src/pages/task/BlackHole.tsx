import RepoGroupAvatar from '@/components/RepoGroupAvatar';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import UserGroupAvatar from '@/components/UserGroupAvatar';
import {
  getBlackHoleCommitList,
  getBlackHoleInfo,
  updateBlackHoleCommitReadStatus,
} from '@/services/tasks';
import { getUserListOptions } from '@/services/user';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { API } from 'types';
import { Common } from 'types/common';
import { Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import RepoAvatarWithName from '@/components/RepoAvatarWithName';
import { getReposList } from '@/services/repos';
import CommitTypeSelect from '@/components/CommitTypeSelect';

const { Paragraph } = Typography;

const BlackHole: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [userOptions, seUserOptions] = useState<Common.UserSelectOptionItem[]>([]);
  const [currentRow, setCurrentRow] = useState<API.BlackHoleCommitItem | null>(null);
  const [info, setInfo] = useState<API.BlackHoleInfo>();
  const actionRef = useRef<ActionType>();
  const [repoList, setRepoList] = useState<API.ReposItem[]>([]);
  const [copyPrefix, setCopyPrefix] = useState('feat');

  useEffect(() => {
    getUserListOptions().then((res) => seUserOptions(res));
    getBlackHoleInfo().then((res) => {
      setInfo(res);
    });
    getReposList({ current: 1, pageSize: 100 }).then((res) => {
      setRepoList(res.list);
    });
  }, []);

  const handleUpdateReadStatus = (id: string) => {
    return updateBlackHoleCommitReadStatus(id)
      .then(() => {
        actionRef.current?.reload();
      })
      .catch(() => {});
  };

  const columns: ProColumns<API.BlackHoleCommitItem>[] = [
    {
      title: '仓库名称',
      dataIndex: 'slug',
      valueType: 'text',
      width: 160,
      renderText: (text, record) => {
        const curr = repoList.find((item) => item.name === record.slug);
        if (repoList && curr) {
          return (
            <RepoAvatarWithName
              repo={{
                name: record.slug,
                group: curr.group,
                description: curr.description,
              }}
            />
          );
        } else {
          return <span>{record.slug}</span>;
        }
      },
    },
    {
      title: '提交人',
      dataIndex: 'author',
      valueType: 'select',
      valueEnum: userOptions.reduce((acc, cur) => {
        Object.assign(acc, {
          [cur.value]: { text: cur.label },
        });
        return acc;
      }, {}),
      width: 180,
      render: (text, record) => {
        return <UserAvatarWithName user={record.author} />;
      },
    },
    {
      title: '分支',
      dataIndex: 'branch',
      valueType: 'text',
      copyable: true,
      width: 220,
    },
    {
      title: 'Commit ID',
      dataIndex: 'commitId',
      valueType: 'text',
      width: 160,
      renderText: (text, record) => {
        return (
          <a
            href={record.commitUrl}
            target="_blank"
            rel="noreferrer"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentRow(record);
              // TODO: Hardcode Vitace
              if (!record.readStatus && currentUser?.email === 'vitace@kupotech.com') {
                await handleUpdateReadStatus(record._id);
              }
              window.open(record.commitUrl);
            }}
          >
            {currentRow?._id === record._id && <ArrowRightOutlined color="blue" />}
            {text}
          </a>
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      valueType: 'dateTimeRange',
      align: 'center',
      colSize: 2,
      width: 220,
      render: (text, record) => {
        return formatDateToYYYYMMDDHHmmss(record.createdAt);
      },
    },
    {
      title: '已读状态',
      dataIndex: 'readStatus',
      valueType: 'select',
      width: 120,
      align: 'center',
      fixed: 'right',
      valueEnum: {
        true: { text: '已读', status: 'Success' },
        false: { text: '未读', status: 'Processing' },
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: null,
      }}
      content={
        info && (
          <ProDescriptions column={2} style={{ marginBlockEnd: -16 }} bordered>
            <ProDescriptions.Item
              label={
                <>
                  任务ID <br />
                  <CommitTypeSelect value={copyPrefix} onChange={(value) => setCopyPrefix(value)} />
                </>
              }
              valueType="text"
            >
              <Paragraph copyable={{ text: `${copyPrefix}(${info.taskId}): ` }}>
                {info?.taskId}
              </Paragraph>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="最近提交时间" valueType="dateTime">
              {info?.lastCommitAt}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="参与人" span={2}>
              <div style={{ minWidth: '500px', overflowX: 'auto' }}>
                <UserGroupAvatar data={info.users} />
              </div>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="相关仓库" span={2}>
              <RepoGroupAvatar data={info.repos} />
            </ProDescriptions.Item>
          </ProDescriptions>
        )
      }
    >
      <ProTable
        style={{ marginTop: 12 }}
        headerTitle="提交记录"
        rowKey="_id"
        actionRef={actionRef}
        expandable={{
          fixed: 'left',
        }}
        search={{
          defaultCollapsed: false,
        }}
        columns={columns}
        request={async (params) => {
          const res = await getBlackHoleCommitList(params);
          return {
            success: true,
            data: res.list,
            total: res.total,
          };
        }}
      />
    </PageContainer>
  );
};
export default BlackHole;
