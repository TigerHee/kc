import { deleteProject, getProjectsList } from '@/services/projects';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Pagination, Segmented, message } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';
import { CreateProjectModalWithButton } from './components/CreateProjectModalWithButton';
import { history } from '@umijs/max';
import { getReposList } from '@/services/repos';
import { Common } from 'types/common';
import { getUserListOptions } from '@/services/user';
import { AppstoreOutlined, BarsOutlined, ReloadOutlined } from '@ant-design/icons';
import ProjectKanbanView from './components/ProjectKanbanView';
import ProjectListView from './components/ProjectListView';
import { getWorkflowOptions } from '@/services/workflow';

const ProjectList: React.FC = () => {
  const [viewType, setViewType] = useState<'Kanban' | 'List'>('Kanban');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.ProjectsItem[]>([]);
  const [repos, setRepos] = useState<API.ReposItem[]>([]);
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);
  const [workflowOptions, setWorkflowOptions] = useState<Common.WorkflowOptionItem[]>([]);

  const fetchData = async (query: any) => {
    setLoading(true);
    getProjectsList(query)
      .then((res) => {
        console.log(res.list);
        setList(res.list);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData({ ...pagination });
    getReposList({ current: 1, pageSize: 100 }).then((res) => {
      setRepos(res.list);
    });
    getUserListOptions().then((res) => {
      setUserOptions(res);
    });
    getWorkflowOptions().then((res) => {
      setWorkflowOptions(res);
    });
  }, []);

  const handleRefresh = () => {
    fetchData({ ...pagination });
  };

  const handleDelete = (id: string) => {
    deleteProject(id).then(() => {
      message.success('删除成功');
      fetchData({ ...pagination });
    });
  };

  const handleGoDetail = (name: string) => {
    history.push(`/project/detail/${name}`);
  };

  return (
    <PageContainer
      fixedHeader
      subTitle={
        <Segmented
          value={viewType}
          onChange={(value: 'Kanban' | 'List') => {
            setViewType(value);
          }}
          options={[
            { value: 'Kanban', icon: <AppstoreOutlined /> },
            { value: 'List', icon: <BarsOutlined /> },
          ]}
        />
      }
      extra={[
        <CreateProjectModalWithButton
          key="create"
          repos={repos}
          userOptions={userOptions}
          workflowOptions={workflowOptions}
          onSuccess={() => fetchData({ ...pagination })}
        />,
        <Button
          key="refresh"
          onClick={handleRefresh}
          loading={loading}
          type="default"
          icon={<ReloadOutlined />}
        >
          刷新数据
        </Button>,
      ]}
    >
      <Card loading={loading} bordered={false}>
        {viewType === 'Kanban' && (
          <ProjectKanbanView
            list={list}
            repos={repos}
            workflowOptions={workflowOptions}
            userOptions={userOptions}
            handleDelete={handleDelete}
            handleGoDetail={handleGoDetail}
            handleUpdateSuccess={() => fetchData({ ...pagination })}
          />
        )}
        {viewType === 'List' && (
          <ProjectListView
            repos={repos}
            list={list}
            userOptions={userOptions}
            workflowOptions={workflowOptions}
            handleDelete={handleDelete}
            handleGoDetail={handleGoDetail}
            handleUpdateSuccess={() => fetchData({ ...pagination })}
          />
        )}
        <Pagination
          key="pagination"
          size="small"
          style={{ padding: '16px 0', justifyContent: 'flex-end' }}
          {...pagination}
          total={total}
          showSizeChanger
          showTotal={(total) => `总共 ${total} 项目`}
          onShowSizeChange={(current, pageSize) => {
            fetchData({
              current,
              pageSize,
            });
          }}
          onChange={(page, pageSize) => {
            setPagination({
              current: page,
              pageSize,
            });
            fetchData({
              current: page,
              pageSize,
            });
          }}
        />
      </Card>
    </PageContainer>
  );
};
export default ProjectList;
