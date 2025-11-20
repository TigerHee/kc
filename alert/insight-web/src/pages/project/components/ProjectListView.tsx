import ProjectAvatarWithName from '@/components/ProjectAvatarWithName';
import RepoAvatarWithName from '@/components/RepoAvatarWithName';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import { UpdateProjectModalWithButton } from './UpdateProjectModalWithButton';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import { DeleteOutlined, FundViewOutlined } from '@ant-design/icons';
import { Badge, Button, Popconfirm, Space, Table } from 'antd';
import { TableProps } from 'antd/es/table';
import { API } from 'types';
import { Common } from 'types/common';
import useUser from '@/hooks/useUser';

const ProjectListView: React.FC<{
  list: API.ProjectsItem[];
  repos: API.ReposItem[];
  userOptions: Common.UserSelectOptionItem[];
  workflowOptions: Common.WorkflowOptionItem[];
  handleDelete: (id: string) => void;
  handleGoDetail: (name: string) => void;
  handleUpdateSuccess: () => void;
}> = (props) => {
  const {
    list,
    repos,
    userOptions,
    workflowOptions,
    handleDelete,
    handleGoDetail,
    handleUpdateSuccess,
  } = props;
  const { isAdmin } = useUser();

  const columns: TableProps<API.ProjectsItem>['columns'] = [
    {
      title: '项目',
      width: 250,
      fixed: 'left',
      render: (text, record) => {
        return <ProjectAvatarWithName project={{ name: record.name }} />;
      },
    },
    {
      title: '负责人',
      width: 200,
      render: (text, record) => {
        return <UserAvatarWithName user={record.owner} />;
      },
    },
    {
      title: '仓库',
      width: 280,
      render: (text, record) => {
        return <RepoAvatarWithName repo={record.repos} />;
      },
    },
    {
      title: '状态',
      width: 100,
      render: (text, record) => {
        if (record.status) {
          return <Badge status="success" text="开启" />;
        }
        return <Badge status="default" text="未使用" />;
      },
    },
    {
      title: '访问链接',
      width: 420,
      render: (text, record) => {
        return <a href={record.accessibleLink}>{record.accessibleLink}</a>;
      },
    },
    {
      title: '更新时间',
      width: 200,
      render: (text, record) => {
        if (!record.updatedAt) {
          return '-';
        }
        return formatDateToYYYYMMDDHHmmss(record.updatedAt);
      },
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space size={10}>
            <Button.Group>
              <Button onClick={() => handleGoDetail(record.name)} icon={<FundViewOutlined />} />
              {isAdmin && (
                <UpdateProjectModalWithButton
                  workflowOptions={workflowOptions}
                  userOptions={userOptions}
                  simply={true}
                  data={record}
                  repos={repos}
                  onSuccess={handleUpdateSuccess}
                />
              )}
              {isAdmin && (
                <Popconfirm
                  placement="topLeft"
                  title={'确认删除'}
                  description="确认要删除项目吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => handleDelete(record._id)}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              )}
            </Button.Group>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<API.ProjectsItem>
      columns={columns}
      dataSource={list}
      pagination={false}
      expandable={{ fixed: 'left' }}
    />
  );
};

export default ProjectListView;
