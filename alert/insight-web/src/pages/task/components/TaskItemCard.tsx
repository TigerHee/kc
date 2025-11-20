import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Badge, Button, Popconfirm, Popover } from 'antd';
import { API } from 'types';
import { UpdateTaskModalWithButton } from './UpdateTaskModalWithButton';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import UserGroupAvatar from '@/components/UserGroupAvatar';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import RepoGroupAvatar from '@/components/RepoGroupAvatar';

interface TaskItemCardProps {
  task: API.TaskItem;
  loading: boolean;
  isShowDeleteBtn: boolean;
  handleRefresh: (id: string) => void;
  handleGoDetail: (id: string) => void;
  handleDelete: (id: string) => void;
  onEditSuccess: () => void;
}
const TaskItemCard: React.FC<TaskItemCardProps> = (props) => {
  const {
    task,
    loading,
    handleRefresh,
    // handleGoDetail,
    onEditSuccess,
    handleDelete,
    isShowDeleteBtn,
  } = props;

  const renderHybridStatus = (task: API.TaskItem) => {
    if (!task.wiki.status) {
      return <Badge color="gray" count={`wiki状态异常`}></Badge>;
    }
    if (
      task.wiki?.needH5Audit === undefined ||
      task.wiki?.needH5Audit === null ||
      task.wiki?.needH5Audit === false
    ) {
      return <Badge color="green" count={`非Hybrid页面`}></Badge>;
    }
    if (task.wiki.h5AuditStatus === true) {
      return <Badge color="green" count={`已通过`}></Badge>;
    }
    if (task.wiki.h5AuditStatus === false) {
      return <Badge color="red" count={`未通过`}></Badge>;
    }
    return '-';
  };

  return (
    <ProCard bordered style={{ border: '1px solid #ddd' }} hoverable loading={loading}>
      <ProDescriptions
        title={task.taskName}
        column={3}
        columns={[
          {
            title: '操作',
            valueType: 'option',
            render: () => {
              return (
                <>
                  <Button
                    key="refresh"
                    type="dashed"
                    icon={<ReloadOutlined />}
                    onClick={() => handleRefresh(task._id)}
                  >
                    刷新
                  </Button>
                  <UpdateTaskModalWithButton key="edit" onSuccess={onEditSuccess} data={task} />,
                  {/* <Button key="detail" icon={<InfoOutlined />} onClick={() => handleGoDetail(task._id)}>
                详情
              </Button>, */}
                  {isShowDeleteBtn && (
                    <Popconfirm
                      key="delete"
                      placement="topLeft"
                      title="确认删除吗？"
                      description="删除后将不可见，且使用该任务ID的提交将不符合规范"
                      okText="确认"
                      cancelText="取消"
                      onConfirm={() => handleDelete(task._id)}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  )}
                </>
              );
            },
          },
        ]}
      >
        <ProDescriptions.Item label="任务ID" span={1} ellipsis valueType="text" copyable>
          {task.taskId}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间" span={1} ellipsis valueType="text">
          {formatDateToYYYYMMDDHHmmss(task.createdAt)}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间" span={1} ellipsis valueType="text">
          {task.updatedAt ? formatDateToYYYYMMDDHHmmss(task.updatedAt) : '-'}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="方案状态" span={1}>
          {task.wiki.status ? (
            <Badge color="green" count={`已通过`}></Badge>
          ) : (
            <Popover
              content={
                <div>
                  {task.wiki.errors.map(({ title, content }) => (
                    <div key={title}>
                      <b style={{ fontWeight: 500 }}>{title}: </b>
                      <span style={{ color: 'red' }}>{content}</span>
                    </div>
                  ))}
                </div>
              }
            >
              <Badge color="red" count={`未通过`}></Badge>
            </Popover>
          )}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="方案链接" span={1} ellipsis>
          <a href={task.wiki.url} target="_blank" rel="noreferrer">
            {task.wiki.title}
          </a>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="任务状态" span={1}>
          {task.status ? (
            <Badge color="green" text="已完成"></Badge>
          ) : (
            <Badge color="blue" text="进行中"></Badge>
          )}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="Hybrid审核" span={1}>
          {renderHybridStatus(task)}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="负责人" span={1}>
          <UserAvatarWithName user={task?.user} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="相关仓库" span={2} tooltip="部分需要洞察的仓库，不是全部">
          <RepoGroupAvatar data={task.involveRepos} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="使用人" span={2}>
          <UserGroupAvatar data={task?.involveUsers} styles={{ height: 32 }} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="流程版本" span={1}>
          <Badge
            color="green"
            count={task.wikiCheckerVersion.toFixed(1)}
            style={{ backgroundColor: '#52c41a' }}
          />
        </ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
  );
};

export default TaskItemCard;
