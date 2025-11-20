import { DeleteOutlined, FundViewOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Badge, Button, Popconfirm, Popover, Space } from 'antd';
import { API } from 'types';
import { UpdateProjectModalWithButton } from './UpdateProjectModalWithButton';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import RepoAvatarWithName from '@/components/RepoAvatarWithName';
import useUser from '@/hooks/useUser';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import ProjectAvatarWithName from '@/components/ProjectAvatarWithName';
import { Common } from 'types/common';
import { WorkflowStep } from '@/components/WorkflowStep';

interface ProjectItemCardProps {
  project: API.ProjectsItem;
  repos: API.ReposItem[];
  userOptions: Common.UserSelectOptionItem[];
  workflowOptions: Common.WorkflowOptionItem[];
  handleDelete: (id: string) => void;
  handleGoDetail: (name: string) => void;
  handleUpdateSuccess: () => void;
}

const ProjectItemCard: React.FC<ProjectItemCardProps> = (props) => {
  const {
    project,
    repos,
    userOptions,
    workflowOptions,
    handleDelete,
    handleUpdateSuccess,
    handleGoDetail,
  } = props;
  const { isAdmin } = useUser();

  console.log('project', project);

  if (!project) {
    return null;
  }

  return (
    <ProCard
      key={project._id}
      title={<ProjectAvatarWithName project={{ name: project.name }} />}
      hoverable
      style={{ border: '1px solid #ddd' }}
      extra={
        <>
          {isAdmin && (
            <Popconfirm
              placement="topLeft"
              title={'确认删除'}
              description="确认要删除项目吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleDelete(project._id)}
            >
              <Button icon={<DeleteOutlined />} danger style={{ marginRight: 8 }}>
                删除项目
              </Button>
            </Popconfirm>
          )}
          <Button
            type="default"
            icon={<FundViewOutlined />}
            onClick={() => handleGoDetail(project.name)}
            style={{ marginRight: 8 }}
          >
            项目详情
          </Button>
          {isAdmin && (
            <UpdateProjectModalWithButton
              workflowOptions={workflowOptions}
              userOptions={userOptions}
              data={project}
              repos={repos}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </>
      }
    >
      <ProDescriptions column={4} bordered labelStyle={{ width: 120 }}>
        <ProDescriptions.Item label="状态" span={2}>
          {project.status ? (
            <Badge status="success" text="开启" />
          ) : (
            <Badge status="default" text="未使用" />
          )}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间" valueType="dateTime" span={2}>
          {project.createdAt}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="仓库" span={2}>
          <RepoAvatarWithName repo={project.repos} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间" valueType="dateTime" span={2}>
          {project.updatedAt}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="负责人" span={2}>
          <UserAvatarWithName user={project.owner} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="访问链接" span={2}>
          <a target="_blank" href={project.accessibleLink} rel="noreferrer">
            官网具体入口地址
          </a>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="路由" span={2}>
          <ProDescriptions>
            <ProDescriptions.Item label="状态">
              {project.metaRoutes.status === true ? (
                <Badge status="success" text="开启" />
              ) : project.metaRoutes.status === false ? (
                <Badge status="default" text="未使用" />
              ) : (
                '-'
              )}
              <Popover
                placement="topRight"
                title={'简要信息'}
                content={
                  <div>
                    {project.metaRoutes.updatedAt && (
                      <div>
                        <span>更新时间：</span>
                        <span>{formatDateToYYYYMMDDHHmmss(project.metaRoutes.updatedAt)}</span>
                      </div>
                    )}
                    <div>
                      <span>总路由数量：</span>
                      {project.metaRoutes.total && (
                        <Badge color="#01bc8d" count={project.metaRoutes.total} />
                      )}
                    </div>
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                />
              </Popover>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="依赖" span={2}>
          <ProDescriptions>
            <ProDescriptions.Item label="状态">
              {project.metaDeps.status === true ? (
                <Badge status="success" text="开启" />
              ) : project.metaDeps.status === false ? (
                <Badge status="default" text="未使用" />
              ) : (
                '-'
              )}
              <Popover
                placement="topRight"
                title={'简要信息'}
                content={
                  <div>
                    {project.metaDeps.updatedAt && (
                      <div>
                        <span>更新时间：</span>
                        <span>{formatDateToYYYYMMDDHHmmss(project.metaDeps.updatedAt)}</span>
                      </div>
                    )}
                    <div>
                      <span>总依赖：</span>
                      <span>{project.metaDeps.total}</span>
                    </div>
                    <div>
                      <span>没锁版本：</span>
                      <span>{project.metaDeps.unLockTotal}</span>
                    </div>
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                />
              </Popover>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="离线包" span={2}>
          <ProDescriptions>
            <ProDescriptions.Item label="状态">
              {project.metaOfflineAppV3.status === true ? (
                <Badge status="success" text="开启" />
              ) : project.metaOfflineAppV3.status === false ? (
                <Badge status="default" text="未使用" />
              ) : (
                '-'
              )}
              <Popover
                placement="topRight"
                title={'简要信息'}
                content={
                  <div>
                    {project.metaOfflineAppV3.updatedAt && (
                      <div>
                        <span>更新时间：</span>
                        <span>
                          {formatDateToYYYYMMDDHHmmss(project.metaOfflineAppV3.updatedAt)}
                        </span>
                      </div>
                    )}
                    <div>
                      <span>最大缓存大小：</span>
                      <span>{project.metaOfflineAppV3.maximumFileSizeToCacheInBytes}</span>
                    </div>
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                />
              </Popover>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="路由加固" span={2}>
          <ProDescriptions>
            <ProDescriptions.Item label="状态">
              {project.metaJscrambler.status === true ? (
                <Badge status="success" text="开启" />
              ) : project.metaJscrambler.status === false ? (
                <Badge status="default" text="未使用" />
              ) : (
                '-'
              )}
              <Popover
                placement="topRight"
                title={'简要信息'}
                content={
                  <div>
                    {project.metaJscrambler.updatedAt && (
                      <div>
                        <span>更新时间：</span>
                        <span>{formatDateToYYYYMMDDHHmmss(project.metaJscrambler.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                />
              </Popover>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="WebChecker" span={2}>
          <ProDescriptions>
            <ProDescriptions.Item label="状态">
              {project.metaWebChecker.status === true ? (
                <Badge status="success" text="开启" />
              ) : project.metaWebChecker.status === false ? (
                <Badge status="default" text="未使用" />
              ) : (
                '-'
              )}
              <Popover
                placement="topRight"
                title={'简要信息'}
                content={
                  <div>
                    {project.metaWebChecker.updatedAt && (
                      <div>
                        <span>更新时间：</span>
                        <span>{formatDateToYYYYMMDDHHmmss(project.metaWebChecker.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                />
              </Popover>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="WebTest" span={2}>
          <ProDescriptions>
            <ProDescriptions.Item label="状态">
              {project.metaWebTest.status === true ? (
                <Badge status="success" text="开启" />
              ) : project.metaWebTest.status === false ? (
                <Badge status="default" text="未使用" />
              ) : (
                '-'
              )}
              <Popover
                placement="topRight"
                title={'简要信息'}
                content={
                  <div>
                    {project.metaWebTest.updatedAt && (
                      <div>
                        <span>更新时间：</span>
                        <span>{formatDateToYYYYMMDDHHmmss(project.metaWebTest.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                }
              >
                <InfoCircleOutlined
                  style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                />
              </Popover>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="工作流" span={4}>
          <Space direction="vertical">
            {!project.workflowSchedule || project.workflowSchedule?.length === 0 ? (
              <div style={{ height: 51 }}>-</div>
            ) : (
              project.workflowSchedule.map((schedule) => (
                <>
                  {schedule.workflow ? (
                    <WorkflowStep
                      key={schedule.workflow._id}
                      name={schedule.workflow.name}
                      nodes={schedule.workflow.node}
                    />
                  ) : (
                    <div style={{ height: 51 }}>-</div>
                  )}
                </>
              ))
            )}
          </Space>
        </ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
  );
};

export default ProjectItemCard;
