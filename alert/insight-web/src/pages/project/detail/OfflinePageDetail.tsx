import { getProjectDetailByNameOffline } from '@/services/projects';
import { ProDescriptions } from '@ant-design/pro-components';
import { Badge } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';
interface OfflinePageDetailProps {
  name: string;
}
const OfflinePageDetail: React.FC<OfflinePageDetailProps> = (props) => {
  const { name } = props;
  const [data, setData] = useState<API.ProjectDetailOfflineInfo>();
  const [loading, setLoading] = useState(false);
  console.log('name', name);
  // const columns: TableProps<API.RouteItem>['columns'] = []

  useEffect(() => {
    setLoading(true);
    getProjectDetailByNameOffline(name)
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <ProDescriptions bordered column={2} loading={loading}>
        <ProDescriptions.Item label="状态">
          {data?.meta.status ? (
            <Badge status="success" text="开启" />
          ) : (
            <Badge status="default" text="未使用" />
          )}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间" valueType="dateTime">
          {data?.meta.updatedAt}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="最大缓存文件">
          {data?.meta?.maximumFileSizeToCacheInBytes}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="报告ID" copyable>
          {data?.report?._id}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="项目目录" span={2}>
          {data?.report?.projectDistDirName}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="文件匹配模式">
          {data?.report?.globPatterns.map((pattern) => <div key={pattern}>{pattern}</div>)}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="多租户" valueType="jsonCode">
          {JSON.stringify(data?.report?.multiTenantSite, null, 2)}
        </ProDescriptions.Item>
      </ProDescriptions>
    </>
  );
};

export default OfflinePageDetail;
