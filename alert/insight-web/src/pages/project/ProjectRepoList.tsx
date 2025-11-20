import { deleteRepo, getReposGroup, getReposList } from '@/services/repos';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { API } from 'types';
import { CreateRepoModalWithButton } from './components/CreateRepoModalWithButton';
import { Common } from 'types/common';
import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import RepoAvatarWithName from '@/components/RepoAvatarWithName';

const ProjectRepoList: React.FC = () => {
  const ref = useRef<ActionType>();

  const [groupOptions, setGroupOptions] = useState<Common.SelectOptionItem[]>([]);
  useEffect(() => {
    getReposGroup().then((res) => {
      setGroupOptions(res);
    });
  }, []);

  const handleDeleteRepo = (id: string) => {
    deleteRepo(id).then(() => {
      message.success('删除成功');
      ref.current?.reload();
    });
  };

  const columns: ProColumns<API.ReposItem>[] = [
    {
      title: 'id',
      dataIndex: '_id',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      width: 160,
      copyable: true,
      ellipsis: true,
      onCell: undefined,
    },
    {
      title: '分组',
      dataIndex: 'group',
      valueType: 'select',
      valueEnum: groupOptions.reduce((acc, cur) => {
        return { ...acc, [cur.value]: { text: cur.label } };
      }, {}),
      width: 150,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      width: 260,
      fixed: 'left',
      onCell: undefined,
      renderText: (text, record) => {
        return (
          <RepoAvatarWithName
            repo={{
              name: record.slug,
              description: record.description,
              group: record.group,
            }}
          />
        );
      },
    },
    {
      title: 'slug',
      dataIndex: 'slug',
      valueType: 'text',
      width: 260,
      onCell: undefined,
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'text',
      width: 220,
      ellipsis: true,
      onCell: undefined,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 220,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 220,
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      align: 'center',
      hideInSearch: true,
      renderText: (_, record) => {
        return (
          <>
            <Popconfirm
              title="删除仓库"
              description="删除后将不可见，且使用该仓库的提交将不符合规范"
              onConfirm={() => handleDeleteRepo(record._id)}
              okText="确定"
              cancelText="取消"
            >
              <Button style={{ marginLeft: 8 }} danger type="primary" icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </>
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
          toolBarRender={() => [
            <CreateRepoModalWithButton
              key="create"
              groupOptions={groupOptions}
              onSuccess={() => {
                ref.current?.reload();
              }}
            />,
          ]}
          rowKey="_id"
          actionRef={ref}
          columns={columns}
          expandable={{
            fixed: 'left',
          }}
          request={async (params) => {
            console.log('request.params', params);
            const res = await getReposList(params);
            return {
              data: res.list,
              success: true,
              total: res.total,
            };
          }}
        />
      </PageContainer>
    </div>
  );
};
export default ProjectRepoList;
