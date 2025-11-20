import { PageContainer } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { getAlertDetail, getConfigStatus } from '@/services/alert';
import { useRequest } from 'ahooks';
import { Spin, Space, Button } from 'antd';
import ChangeStatus from './components/ChangeStatus';
import DetailInfo from './components/DetailInfo';
import ChangeLog from './components/ChangeLog';
import { useContext, useEffect } from 'react';
import { KeepAliveTabContext } from '@/layouts/context';

export default () => {
  const { onShow } = useContext(KeepAliveTabContext);
  const [searchParams] = useSearchParams();
  const queryObject = Object.fromEntries(searchParams.entries()) as {
    alarmGroup: string;
    url: string;
    message: string;
    _id: string;
  };
  const { data, loading, refresh: refreshList } = useRequest(() => getAlertDetail(queryObject));
  const { data: statusData } = useRequest(getConfigStatus);

  useEffect(() => {
    onShow(() => {
      refreshList();
    });
  }, []);

  useEffect(() => {
    if (data?._id) {
      const currentParams = new URLSearchParams(window.location.search);
      // 如果 query 中没有 _id 参数时才更新
      if (!currentParams.has('_id')) {
        currentParams.set('_id', data._id);
        history.replace({
          pathname: window.location.pathname,
          search: `?${currentParams.toString()}`,
        });
      }
    }
  }, [data?._id]);

  return (
    <PageContainer
      breadcrumb={{
        routes: [
          {
            path: '/alert',
            breadcrumbName: '告警统计',
          },
          {
            path: '/alert/list',
            breadcrumbName: '告警列表',
          },
          {
            path: '',
            breadcrumbName: '告警详情',
          },
        ],
        itemRender: (route) => {
          return (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (route.path) {
                  history.replace(route.path);
                }
              }}
            >
              {route.title}
            </span>
          );
        },
      }}
    >
      <Spin spinning={loading}>
        {data && statusData ? (
          <Space direction="vertical">
            <ChangeStatus data={data} statusData={statusData} refreshList={refreshList} />
            <DetailInfo data={data} statusData={statusData} />
            <ChangeLog data={data} statusData={statusData} />
          </Space>
        ) : loading ? null : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button onClick={() => refreshList()} type="primary">
              数据同步中，大约10秒再试试
            </Button>
          </div>
        )}
      </Spin>
    </PageContainer>
  );
};
