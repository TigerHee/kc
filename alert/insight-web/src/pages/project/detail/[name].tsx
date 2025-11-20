import { getProjectDetailByName } from '@/services/projects';
import { ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useParams, useSearchParams } from '@umijs/max';
import { Button, message } from 'antd';
import { useEffect, useLayoutEffect, useState } from 'react';
import { API } from 'types';
import BasePageDetail from './BasePageDetail';
import ProjectAvatarWithName from '@/components/ProjectAvatarWithName';
import RoutePageDetail from './RoutePageDetail';
import DepsPageDetail from './DepsPageDetail';
import OfflinePageDetail from './OfflinePageDetail';
import JscramblerPageDetail from './JscramblerPageDetail';
import I18nPageDetail from './I18nPageDetail';
import './index.less';
import { UpdateProjectModalWithButton } from '../components/UpdateProjectModalWithButton';
import { getReposList } from '@/services/repos';
import { Common } from 'types/common';
import { getUserListOptions } from '@/services/user';
import { getWorkflowOptions } from '@/services/workflow';
import useUser from '@/hooks/useUser';

const TabList = [
  {
    tab: '基本信息',
    key: 'base' as const,
    closable: false,
  },
  {
    tab: '路由信息',
    key: 'route' as const,
    closable: false,
  },
  {
    tab: '依赖信息',
    key: 'deps' as const,
    closable: false,
  },
  {
    tab: '离线包信息',
    key: 'offline' as const,
    closable: false,
  },
  {
    tab: '路由加固信息',
    key: 'jscrambler' as const,
    closable: false,
  },
  {
    tab: '多语言信息',
    key: 'i18n' as const,
    closable: false,
  },
];

type TabType = (typeof TabList)[number]['key'];
const ProjectDetail: React.FC = () => {
  const { name } = useParams<{ name: TabType }>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [detail, setDetail] = useState<API.ProjectsItemDetail>();
  const [loading, setLoading] = useState(false);
  const [tabActiveKey, setTabActiveKey] = useState<TabType>('base');
  const [repos, setRepos] = useState<API.ReposItem[]>([]);
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);
  const [workflowOptions, setWorkflowOptions] = useState<Common.WorkflowOptionItem[]>([]);
  const { isAdmin } = useUser();

  useLayoutEffect(() => {
    if (tab && TabList.find((t) => t.key === tab)) {
      setTabActiveKey(tab as TabType);
    }
  }, []);

  const handleRefresh = () => {
    if (name) {
      setLoading(true);
      getProjectDetailByName(name)
        .then((res) => {
          message.success('刷新成功');
          setDetail(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (name) {
      getProjectDetailByName(name).then((res) => {
        setDetail(res);
      });
      getReposList({ current: 1, pageSize: 100 }).then((res) => {
        setRepos(res.list);
      });
      getUserListOptions().then((res) => {
        setUserOptions(res);
      });
      getWorkflowOptions().then((res) => {
        setWorkflowOptions(res);
      });
    }
  }, []);

  if (!detail) {
    return null;
  }

  return (
    <PageContainer
      tabActiveKey={tabActiveKey}
      loading={loading}
      onTabChange={(key) => setTabActiveKey(key as TabType)}
      tabList={TabList}
      header={{
        title: detail?.name && <ProjectAvatarWithName project={{ name: detail.name }} />,
        breadcrumb: {},
      }}
      extra={
        <>
          {isAdmin && (
            <UpdateProjectModalWithButton
              userOptions={userOptions}
              data={detail}
              repos={repos}
              onSuccess={handleRefresh}
              workflowOptions={workflowOptions}
            />
          )}
          <Button
            onClick={handleRefresh}
            loading={loading}
            type="primary"
            icon={<ReloadOutlined />}
          >
            刷新数据
          </Button>
        </>
      }
    >
      {tabActiveKey === 'base' && detail && name && <BasePageDetail detail={detail} name={name} />}
      {tabActiveKey === 'route' && detail && name && (
        <RoutePageDetail detail={detail} name={name} />
      )}
      {tabActiveKey === 'deps' && detail && name && <DepsPageDetail name={name} />}
      {tabActiveKey === 'offline' && detail && name && <OfflinePageDetail name={name} />}
      {tabActiveKey === 'jscrambler' && detail && name && <JscramblerPageDetail name={name} />}
      {tabActiveKey === 'i18n' && detail && name && <I18nPageDetail />}
    </PageContainer>
  );
};

export default ProjectDetail;
